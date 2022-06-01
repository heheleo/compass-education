const fetch = require("node-fetch");

/**
 * Gets the tasks of the current user
 * @param {String} BASEURL
 * @param {String} ALL_COOKIES
 * @param {Number} LIMIT Limit of tasks returned
 * @returns {Promise<Response>}
 */
async function GetTaskItems(BASEURL, ALL_COOKIES, LIMIT) {
	return await fetch(
		`https://${BASEURL}/Services/TaskService.svc/GetTaskItems`,
		{
			method: "POST",
			body: JSON.stringify(
				{
					"userIds": LIMIT,
					"page": 1,
					"start": 0
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

module.exports = GetTaskItems;