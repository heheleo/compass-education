export = GetActivityNewsFeedPaged;
/**
 * Gets the news feed page about an activity, such as classes.
 * @param {String} BASEURL
 * @param {String} ALL_COOKIES
 * @param {String} ACTIVITY_ID
 * @param {Number} LIMIT Limit of pages
 * @returns {Promise<Response>}
 */
declare function GetActivityNewsFeedPaged(BASEURL: string, ALL_COOKIES: string, ACTIVITY_ID: string, LIMIT: number): Promise<Response>;
