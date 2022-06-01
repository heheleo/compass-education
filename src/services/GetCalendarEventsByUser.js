const fetch = require("node-fetch");

/**
 * Gets the classes between two dates
 * @param {String} BASEURL 
 * @param {String} ALL_COOKIES 
 * @param {String} USER_ID 
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {Promise<void>}
 */
async function GetCalendarEventsByUser(
	BASEURL, 
	ALL_COOKIES, 
	USER_ID,
	startDate = new Date(),
	endDate = new Date()
) {
	return await fetch(
		`https://${BASEURL}/Services/Calendar.svc/GetCalendarEventsByUser`,
		{
			method: "POST",
			body: JSON.stringify(
				{
					"userId": parseInt(USER_ID),
					"startDate": startDate.toISOString().split("T")[0],
					"endDate": endDate.toISOString().split("T")[0],
					"limit": 25,
					"start": 0,
					"page": 1
				}
			),
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36",
				"Content-Type": "application/json",
				cookie: ALL_COOKIES
			},
		}
	);
}

module.exports = GetCalendarEventsByUser;