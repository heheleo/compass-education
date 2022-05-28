export = GetNamesByID;
/**
 * Gets the name of the current user.
 * @param {String} BASEURL
 * @param {String} ALL_COOKIES
 * @param {String} USER_ID
 * @returns {Promise<Response>}
 */
declare function GetNamesByID(BASEURL: string, ALL_COOKIES: string, USER_ID: string): Promise<Response>;
