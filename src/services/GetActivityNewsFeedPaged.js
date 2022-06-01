const fetch = require("node-fetch");

/**
 * Gets the news feed page about an activity, such as classes
 * @param {String} BASEURL
 * @param {String} ALL_COOKIES
 * @param {String} ACTIVITY_ID
 * @returns {Promise<Response>}
 */
async function GetActivityNewsFeedPaged(BASEURL, ALL_COOKIES, ACTIVITY_ID) {
	return await fetch(
		`https://${BASEURL}/Services/NewsFeed.svc/GetActivityNewsFeedPaged`,
		{
			method: "POST",
			body: JSON.stringify(
				{
					"activityId": ACTIVITY_ID,
					"limit": "25",
					"start": "0",
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

module.exports = GetActivityNewsFeedPaged;