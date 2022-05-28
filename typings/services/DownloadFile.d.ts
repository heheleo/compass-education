export = DownloadFile;
/**
 * Gets the news feed page about an activity, such as classes.
 * @param {String} BASEURL
 * @param {String} ALL_COOKIES
 * @param {String} ID ID of the file you want to download
 * @returns {Promise<Response>}
 */
declare function DownloadFile(BASEURL: string, ALL_COOKIES: string, ID: string): Promise<Response>;
