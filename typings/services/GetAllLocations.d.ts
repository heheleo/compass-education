export = GetAllLocations;
/**
 * Gets all the locations
 * @param {String} BASEURL
 * @param {String} ALL_COOKIES
 * @param {Number} LIMIT Limit of locations returned
 * @returns {Promise<Response>}
 */
declare function GetAllLocations(BASEURL: string, ALL_COOKIES: string, LIMIT: number): Promise<Response>;
