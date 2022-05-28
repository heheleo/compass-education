export = GetAllStaff;
/**
 * Gets all the staff of the school.
 * @param {String} BASEURL
 * @param {String} ALL_COOKIES
 * @param {Number} LIMIT Limit of staff
 * @returns {Promise<Response>}
 */
declare function GetAllStaff(BASEURL: string, ALL_COOKIES: string, LIMIT: number): Promise<Response>;
