import type { Browser, Cookie, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { fetchCookies } from "../cookies";
import GetAllLocations from "../endpoints/GetAllLocations";
import GetUserDetails from "../endpoints/GetUserDetails";
import GetCalendarEvents from "../endpoints/GetCalendarEvents";
import GetAllYearLevels from "../endpoints/GetAllYearLevels";
import GetAllTerms from "../endpoints/GetAllTerms";
import GetFeedItems from "../endpoints/GetFeedItems";

puppeteer.use(StealthPlugin());

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
     * - Array of serialised cookies (e.g. ["cookie1=value1", "cookie2=value2"])
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
     * The user ID of the logged in user.
     */
    public userID: number = -1;
    /**
     * Whether the cookies have been set in the browser.
     */
    private hasSetCookies: boolean = false;
    /**
     * The Puppeteer browser instance.
     */
    private browser: Browser | null = null;
    /**
     * The primary page used for making requests.
     */
    private page: Page | null = null;

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
    /**
     * Constructs a new CompassClient instance. Note that cookies is an optional
     * parameter (as you may call {@link CompassClient.login}). You must set the
     * cookies before making requests to Compass's endpoints.
     *
     * Call {@link CompassClient.initialise} after constructing the instance, to
     * create the browser used for making requests.
     *
     * @param {string} baseURL The base URL of the institute using Compass.
     */
    constructor(baseURL: string);
    constructor(arg: CompassClientConstructorParams | string) {
        let params: CompassClientConstructorParams = {
            baseURL: "",
            cookies: [],
        };

        // Check if the argument is a string:
        if (typeof arg === "string") {
            // The argument is a base URL:
            params.baseURL = arg.startsWith("https") ? arg : `https://${arg}`;
        } else {
            // The argument is a params object:
            params = arg;
        }

        if (!params.baseURL)
            throw new Error(
                "Base URL is required when constructing a CompassClient instance."
            );
        this.baseURL = params.baseURL;

        if (params.cookies && params.cookies.length) {
            // Check if the cookies are Puppeteer cookies:
            if (typeof params.cookies[0] !== "string") {
                this.cookies = params.cookies as Cookie[];
            } else {
                // Convert the cookies to Puppeteer cookies:
                this.cookies = CompassClient.unmarshalCookies(
                    params.cookies as string[]
                );
            }

            // Convert the cookies to Puppeteer cookies:
            this.cookies = CompassClient.unmarshalCookies(
                params.cookies as string[]
            );
        }
    }

    /**
     * Initialise the browser used for requests. This method should be called
     * after constructing the instance, and before making any requests to
     * Compass's endpoints.
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
        const userAgent =
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
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
        // Check if base URL contains the protocol:
        this.baseURL = baseURL.startsWith("https")
            ? baseURL
            : `https://${baseURL}`;
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

        // Check if the cookies are Puppeteer cookies. Should use a user-defined
        // type guard here
        if (typeof cookies[0] !== "string") {
            this.cookies = cookies as Cookie[];
        } else {
            // Convert the cookies to Puppeteer cookies:
            this.cookies = CompassClient.unmarshalCookies(cookies as string[]);
        }

        // Set the cookies in the browser:
        if (this.browser) await this.browser.setCookie(...this.cookies);

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
        // Check if the browser has been initialised:
        if (!this.browser || !this.page) {
            // Initialise the browser, if not already done:
            await this.initialise();
        }

        // Check if the browser has been initialised:
        if (!this.browser || !this.page)
            throw new Error("Failed to initialise the browser.");

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

        // In order for subsequent requests to work, we need to perform these
        // specific requests to Compass's endpoints.
        // I have no idea why this is necessary, but it is.
        await this.getAllLocations();
        await this.getUserDetails();
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
    public async request(
        endpoint: string,
        method: "GET" | "POST" = "GET",
        body?: any
    ): Promise<any> {
        // Check if the browser has been initialised:
        if (!this.browser || !this.page) {
            // Initialise the browser, if not already done:
            await this.initialise();
        }

        // Check if the cookies have been set:
        if (!this.cookies || !this.cookies.length)
            throw new Error("Cookies must be set before making requests.");

        // Check if the browser has been initialised:
        if (!this.browser || !this.page)
            throw new Error("Failed to initialise the browser.");

        // Set the cookies in the browser if they haven't been set:
        if (!this.hasSetCookies) {
            await this.browser.setCookie(...this.cookies);
            this.hasSetCookies = true;
        }

        // Go to the main page, if not already there:
        if (this.page.url() !== this.baseURL) {
            await this.page.goto(this.baseURL, {
                waitUntil: "domcontentloaded",
            });
        }

        // Get the user ID if not already set:
        if (this.userID === -1) {
            const userId = await this["page"].evaluate(
                "window?.Compass?.organisationUserId"
            );
            if (!Number.isInteger(userId)) {
                throw new Error("Could not find the user ID");
            }

            this.userID = userId as number;
        }

        this.baseURL = this.page.url();

        // Construct the URL:
        const url = new URL(endpoint, this.baseURL).toString();

        // Make the request using the browser:
        const response = await this.page.evaluate(
            (url: string, method: string, body: any) => {
                return fetch(url, {
                    credentials: "include",
                    headers: {
                        Accept: "*/*",
                        "Accept-Language": "en-AU,en;q=0.9",
                        "Content-Type": "application/json",
                    },
                    method,
                    mode: "cors",
                    redirect: "follow",
                    body,
                }).then((a) => a.json());
            },
            url,
            method,
            JSON.stringify(body)
        );

        return response;
    }

    /**
     * Terminates the browser instance, which results in the client being unable
     * to make subsequent requests to Compass's endpoints.
     */
    public async logout() {
        // Check if the browser has been initialised:
        if (!this.browser) {
            // Throw an error if the browser has not been initialised:
            throw new Error(
                "Browser has not been initialised, but you are trying to terminate it."
            );
        }

        // Close the browser:
        await this.browser.close();
    }

    public getAllLocations = GetAllLocations;
    public getUserDetails = GetUserDetails;
    public getCalendarEvents = GetCalendarEvents;
    public getAllYearLevels = GetAllYearLevels;
    public getAllTerms = GetAllTerms;
    public getFeedItems = GetFeedItems;
}
