import type { Browser, Cookie, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import AdBlockerPlugin from "puppeteer-extra-plugin-adblocker";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import UserAgent from "user-agents";
import { fetchCookies } from "../cookies";
import GetAllLocations from "../endpoints/GetAllLocations";
import GetUserDetails from "../endpoints/GetUserDetails";

puppeteer.use(StealthPlugin());
puppeteer.use(AdBlockerPlugin({ blockTrackers: true }));

interface CompassClientConstructorParams {
	/**
	 * The base URL of the institute using Compass.
	 * @example XXX.compass.education
	 * @example https://XXX.compass.education
	 */
	baseURL: string;

	/**
	 * The cookies of the logged in Compass session. This is required to pass
	 * Compass's security checks. This accepts a list of cookies in the format
	 * of:
	 * - Array of serialised cookies (e.g. ["cookie1=value1; cookie2=value2"])
	 * - Array of Puppeteer {@link Cookie}
	 *
	 * **If you do not have any cookies, fetch the cookies with credentials
	 *  using the {@link CompassClient.login} method.**
	 */
	cookies?: string[] | Cookie[];
}

interface CompassClientFetchCookiesParams {
	/**
	 * The username of the Compass account.
	 */
	username: string;
	/**
	 * The password of the Compass account.
	 */
	password: string;
}

/**
 * The client class for interacting with Compass Education. Provides methods for
 * logging in and fetching data.
 * @class CompassClient
 */
export class CompassClient {
	/**
	 * The base URL of the institute using Compass.
	 */
	public baseURL: string;
	/**
	 * The cookies of the logged in Compass session. This is required to pass
	 * Compass's Cloudflare checks.
	 */
	public cookies?: Cookie[];
	/**
	 * Whether the cookies have been set in the browser.
	 */
	private hasSetCookies: boolean = false;
	/**
	 * The Puppeteer browser instance.
	 */
	private browser: Browser;
	/**
	 * The primary page used for making requests.
	 */
	private page: Page;

	/**
	 * Constructs a new CompassClient instance. Note that cookies is an optional
	 * parameter (as you may call {@link CompassClient.login}). You must set the
	 * cookies before making requests to Compass's endpoints.
	 *
	 * Call {@link CompassClient.initialise} after constructing the instance, to
	 * create the browser used for making requests.
	 *
	 * @param {CompassClientConstructorParams} params The parameters for
	 * constructing a CompassClient instance.
	 */
	constructor({ baseURL, cookies }: CompassClientConstructorParams);
	constructor({ baseURL, cookies }: CompassClientConstructorParams) {
		if (!baseURL)
			throw new Error(
				"Base URL is required when constructing a CompassClient instance."
			);
		this.baseURL = baseURL;

		if (cookies && cookies.length) {
			// Check if the cookies are Puppeteer cookies:
			if (typeof cookies[0] !== "string") {
				this.cookies = cookies as Cookie[];
			} else {
				// Convert the cookies to Puppeteer cookies:
				this.cookies = CompassClient.unmarshalCookies(
					cookies as string[]
				);
			}

			// Convert the cookies to Puppeteer cookies:
			this.cookies = CompassClient.unmarshalCookies(cookies as string[]);
		}
	}

	/**
	 * Initialise the CompassClient instance. This method should be called after
	 * constructing the instance, and before making any requests to Compass's
	 * endpoints.
	 *
	 * This creates the browser used for making requests to Compass's endpoints.
	 */
	public async initialise() {
		this.browser = await puppeteer.launch({
			headless: true,
			defaultViewport: { width: 800, height: 600 },
		});
		this.page =
			(await this.browser.pages())[0] || (await this.browser.newPage());
		// Initialise page user agent:
		const userAgent = new UserAgent({ deviceCategory: "mobile" });
		this.page.setUserAgent(userAgent.toString());

		if (this.cookies && this.cookies.length) {
			await this.browser.setCookie(...this.cookies);
			this.hasSetCookies = true;
		}
		return this;
	}

	/**
	 * Sets the base URL of the Compass URL.
	 * @example XXX.compass.education
	 * @example https://XXX.compass.education
	 * @param baseURL the base URL of the institute
	 * @returns {CompassClient} the instance of the client
	 */
	public setBaseURL(baseURL: string) {
		this.baseURL = baseURL;
		return this;
	}

	/**
	 * Sets the cookies of a logged-in Compass session. This is required to make
	 * requests to Compass's endpoints.
	 * @param {string[]} cookies the cookies of a logged-in Compass session, in
	 * the format of ["cookie1=value1;", "cookie2=value2..."]
	 * @returns {CompassClient} the instance of the client
	 */
	public async setCookies(cookies: string[]): Promise<CompassClient>;
	/**
	 * Sets the cookies of a logged-in Compass session. This is required to make
	 * requests to Compass's endpoints.
	 * @param {Cookie[]} cookies the cookies of a logged-in Compass session
	 * @returns {CompassClient} the instance of the client
	 */
	public async setCookies(cookies: Cookie[]): Promise<CompassClient>;
	public async setCookies(cookies: string[] | Cookie[]) {
		// Check if cookies are empty:
		if (cookies.length === 0) throw new Error("Cookies cannot be empty.");

		// Check if the cookies are Puppeteer cookies.
		// Should use a user-defined type guard here
		if (typeof cookies[0] !== "string") {
			this.cookies = cookies as Cookie[];
		} else {
			// Convert the cookies to Puppeteer cookies:
			this.cookies = CompassClient.unmarshalCookies(cookies as string[]);
		}

		// Set the cookies in the browser:
		await this.browser.setCookie(...this.cookies);

		return this;
	}

	/**
	 * Attempts to login into Compass and return cookies of a Compass session,
	 * given the credentials.
	 *
	 * On successful login, the cookies will automatically be set in the client
	 * instance.
	 *
	 * @param {CompassClientFetchCookiesParams} opts The options for fetching
	 * cookies.
	 */
	public async login({
		username,
		password,
	}: CompassClientFetchCookiesParams) {
		const cookies = await fetchCookies({
			username,
			password,
			baseURL: this.baseURL,
			browser: this.browser,
		}).catch((error: Error) => {
			throw error;
		});

		// Check if cookies were fetched:
		if (!cookies || !cookies.length)
			throw new Error("Failed to fetch cookies given the credentials.");

		// Set the cookies in the browser:
		await this.browser.setCookie(...cookies);
		this.cookies = cookies;
		this.hasSetCookies = true;
	}

	/**
	 * Unmarshals the cookies from a serialised format to a Puppeteer cookie
	 * @example ["cookie1=value1;", "cookie2=value2..."]
	 * @param cookies the cookies to serialise
	 * @returns {Cookie[]} cookie objects
	 */
	static unmarshalCookies(cookies: string[]): Cookie[] {
		return cookies.map((cookie) => {
			const [name, value] = cookie.split("=");

			return {
				name: name.trim(),
				value: value.trim(),
				domain: "compass.education",
				path: "/",
				expires: -1,
				httpOnly: false,
				secure: true,
				session: true,
			} as Cookie;
		});
	}

	/**
	 * A wrapper around the {@link fetch} function, which makes a request to a
	 * Compass endpoint, automatically setting the cookies and relevant headers.
	 * @param {string} endpoint the endpoint to request
	 * @param {"GET" | "POST"} method the method to use for the request
	 * @param {any} body the body of the request, if applicable
	 */
	public async request(endpoint: string, method: "GET" | "POST" = "GET", body?: any): Promise<any> {
		if (!this.cookies || !this.cookies.length)
			throw new Error("Cookies must be set before making requests.");

		// Set the cookies in the browser if they haven't been set:
		if (!this.hasSetCookies) {
			await this.browser.setCookie(...this.cookies);
			this.hasSetCookies = true;
		}

		// Go to the main page, if not already there:
		if (this.page.url() !== this.baseURL) {
			await this.page.goto(`${this.baseURL}`, {
				waitUntil: "domcontentloaded",
			});
		}

		// Construct the URL:
		const url = new URL(endpoint, this.baseURL).toString();

		// Make the request using the browser:
		const response = await this.page.evaluate((url: string) => {
			return fetch(url, {
				cache: "default",
				credentials: "include",
				headers: {
					Accept: "*/*",
					"Accept-Language": "en-AU,en;q=0.9",
				},
				method,
				mode: "cors",
				redirect: "follow",
				body
			}).then((a) => a.json());
		}, url);

		return response;
	}

	public getAllLocations = GetAllLocations;
	public getUserDetails = GetUserDetails;
}
