const fetch = require("node-fetch");

/**
 * Gets the news feed page about an activity, such as classes
 * @param {String} BASEURL
 * @param {String} ALL_COOKIES
 * @param {String} ID ID of the file you want to download 
 * @returns {Promise<Response>}
 */
async function DownloadFile(BASEURL, ALL_COOKIES, ID) {
	return await fetch(
		`https://${BASEURL}/Services/FileAssets.svc/DownloadFile?id=${ID}`,
		{
			method: "GET",
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36",
				"Content-Type": "application/json",
				cookie: ALL_COOKIES
			},
		}
	);
}

module.exports = DownloadFile;