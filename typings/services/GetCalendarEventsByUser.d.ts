export = GetCalendarEventsByUser;
/**
 * Gets the classes between two dates
 * @param {String} BASEURL
 * @param {String} ALL_COOKIES
 * @param {String} USER_ID
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<void>}
 */
declare function GetCalendarEventsByUser(BASEURL: string, ALL_COOKIES: string, USER_ID: string, startDate?: Date, endDate?: Date): Promise<void>;
