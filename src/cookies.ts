/**
 * Attempts to fetch the cookies of a logged in Compass session,
 * in order to make subsequent requests to the Compass API more
 * seamless, by avoiding the use of actual browser scraping
 * (we can use the endpoints directly).
 */

import type { Browser, Cookie, Page } from "puppeteer";
import UserAgent from "user-agents";

export interface GenerateCookiesParams {
	/**
	 * The username of the Compass account.
	 */
	username: string;

	/**
	 * The password of the Compass account.
	 * It is recommended to store this in a secure file,
	 * such as a .env file, and not hardcode it in the
	 * source code.
	 */
	password: string;

	/**
	 * This will automatically be appended if you are using the
	 * client class, but if you are using this function directly,
	 * you will need to provide the base URL of the Compass instance.
	 * @example XXX.compass.education
	 * @example https://XXX.compass.education
	 */
	baseURL: string;

	/**
	 * The Puppeteer browser to use for the login process.
	 */
	browser: Browser;

	/**
	 * This is the endpoint that the login request will be sent to.
	 * This should normally not be changed, but it may be different
	 * in special cases.
	 * @default /login.aspx?sessionstate=disabled
	 */
	loginEndpoint?: string;

	// The following are optional parameters that can be used to
	// customize the automation process:
	selectors?: {
		/**
		 * The selector for the username input field.
		 * @default "#username"
		 */
		username?: string;
		/**
		 * The selector for the password input field.
		 * @default "#password"
		 */
		password?: string;
		/**
		 * The selector for the login button.
		 * @default ".signInWrapper > input"
		 */
		loginButton?: string;
	};
}

/**
 * Attempts to fetch the cookies of a logged in Compass session,
 * using browser emulation.
 *
 * @param {GenerateCookiesParams} params The parameters for generating the cookies.
 */
export async function fetchCookies({
	username,
	password,
	baseURL,
	browser,
	loginEndpoint = "/login.aspx?sessionstate=disabled",
	selectors,
}: GenerateCookiesParams): Promise<Cookie[]> {
	// Append https:// if it is not already present:
	const transformedBaseURL = baseURL.startsWith("http")
		? baseURL
		: "https://" + baseURL;

	// Transform baseURL into a URL instance and append the login endpoint:
	const url = new URL(loginEndpoint, transformedBaseURL);

	// Determine the actual target request URL:
	const href = url.href;
	
	// Create a new page or use the existing one:
	const page =
		(await browser.pages())[0] || (await browser.newPage());

	// Navigate to the login page and fill in the credentials:
	await page.goto(href, { waitUntil: "networkidle0" });
	await page.type(selectors?.username ?? "#username", username);
	await page.type(selectors?.password ?? "#password", password);

	// Submit the form and wait for the navigation to complete:
	await Promise.all([
		page.click(selectors?.loginButton ?? ".signInWrapper > input"),
		page.waitForNavigation({ waitUntil: "networkidle0" }),
	]);

	// Check if there was an error in the login process:
	const error = await page.$(".error");
	if (error) {
		const errorMessage = await page.evaluate(
			(element) => element.textContent,
			error
		);
		throw new Error(`Failed to login: ${errorMessage}`);
	}

	// Export the cookies:
	const cookies = await browser.cookies();

	return cookies;
}
