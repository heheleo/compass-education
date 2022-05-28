export = GetCalendarEventsByUser;
/**
 * Gets the classes between two dates.
 * @param {String} BASEURL
 * @param {String} ALL_COOKIES
 * @param {String} USER_ID
 * @param {String} startDate
 * @param {String} endDate
 * @param {String} limit
 * @returns {Promise<void>}
 */
declare function GetCalendarEventsByUser(BASEURL: string, ALL_COOKIES: string, USER_ID: string, startDate?: string, endDate?: string, limit?: string): Promise<void>;
