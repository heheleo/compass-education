const fetch = require("node-fetch");

/**
 * Gets the name of the current user.
 * @param {String} BASEURL
 * @param {String} ALL_COOKIES
 * @param {String} instanceId instanceId of the class.
 * @returns {Promise<Response>}
 */
async function GetLessonsByInstanceIdQuick(BASEURL, ALL_COOKIES, instanceId) {
	// 
	return await fetch(
		`https://${BASEURL}/Services/Activity.svc/GetLessonsByInstanceIdQuick`,
		{
			method: "POST",
			body: JSON.stringify(
				{
					"instanceId": instanceId
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

module.exports = GetLessonsByInstanceIdQuick;