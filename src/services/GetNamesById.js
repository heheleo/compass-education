const fetch = require("node-fetch");

/**
 * Gets the name of the current user
 * @param {String} BASEURL
 * @param {String} ALL_COOKIES
 * @param {String} USER_ID
 * @returns {Promise<Response>}
 */
async function GetNamesByID(BASEURL, ALL_COOKIES, USER_ID) {
	return await fetch(
		`https://${BASEURL}/Services/User.svc/GetNamesById`,
		{
			method: "POST",
			body: JSON.stringify(
				{
					"userIds": [USER_ID],
					"page": 1,
					"start": 0,
					"limit": 25
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

module.exports = GetNamesByID;