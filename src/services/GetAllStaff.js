const fetch = require("node-fetch");

/**
 * Gets all the staff of the school.
 * @param {String} BASEURL
 * @param {String} ALL_COOKIES
 * @returns {Promise<Response>}
 */
async function GetAllStaff(BASEURL, ALL_COOKIES) {
	return await fetch(
		`https://${BASEURL}/Services/User.svc/GetAllStaff`,
		{
			method: "POST",
			body: JSON.stringify(
				{
					"limit": 25,
					"page": 1,
					"start": 0,
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

module.exports = GetAllStaff;