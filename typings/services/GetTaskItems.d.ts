export = GetTaskItems;
/**
 * Gets the tasks of the current user.
 * @param {String} BASEURL
 * @param {String} ALL_COOKIES
 * @param {Number} LIMIT Limit of tasks returned
 * @returns {Promise<Response>}
 */
declare function GetTaskItems(BASEURL: string, ALL_COOKIES: string, LIMIT: number): Promise<Response>;
