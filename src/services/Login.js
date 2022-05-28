const fetch = require("node-fetch");

/**
 * Logs the user in.
 * @param {String} BASEURL 
 * @param {String} username 
 * @param {String} password
 * @param {Object} [options] 
 * @returns {Promise<Response>}
 */
async function Login(BASEURL, username, password, options) {
	// Params
	const params = new URLSearchParams();
	params.append("username", username);
	params.append("password", password);
	params.append("__EVENTTARGET", "button1");

	return await fetch(
		`https://${BASEURL}/login.aspx?sessionstate=disabled`,
		{
			method: "POST",
			body: params,
			redirect: "manual",
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36",
				"Connection": "keep-alive"
			},
			...options
		}
	);
}

module.exports = Login;