export = Login;
/**
 * Logs the user in.
 * @param {String} BASEURL
 * @param {String} username
 * @param {String} password
 * @returns {Promise<Response>}
 */
declare function Login(BASEURL: string, username: string, password: string, options: any): Promise<Response>;
