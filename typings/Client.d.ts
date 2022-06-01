export = Client;
/**
 * Starting point for interacting with the client.
 * @class
 */
declare class Client {
    /**
     * Constructor of the client.
     * @param {String} [baseURL] Base URL of your school, can be set via setBaseURL() also
     */
    constructor(baseURL?: string);
    BASEURL: string;
    SID: string;
    ALL_COOKIES: string;
    USER_ID: any;
    /**
     * Takes in a string as a variable. Sets the base URL.
     * @param {String} url the base URL of the school
     */
    setBaseURL(url: string): void;
    /**
     * Logs the client in, and returns a SID.
     * @param {String} username username of the user
     * @param {String} password password of the user
     * @returns {Promise<string>} the SID of the user
     */
    login(username: string, password: string): Promise<string>;
    /**
     * Gets the current user's name information.
     * @returns {Promise<Object>} information about the user's name.
     */
    getName(): Promise<any>;
    /**
     * Gets the classes on a specific date range, or the current date if none is provided.
     * @param {Date} dateFrom the start of range
     * @param {Date} dateTo the end of range
     * @param {boolean} raw raw response from Compass
     * @returns {Promise<Array<Object>>}
     */
    getClasses(dateFrom?: Date, dateTo?: Date, raw?: boolean): Promise<Array<any>>;
    /**
     * Gets the news feed for an activity
     * @param {string} activityId id of the activity
     * @param {Object} options change the limit or raw mode
     * @returns {Promise<Array<Object>>}
     */
    getActivityNewsFeed(activityId: string, options?: any): Promise<Array<any>>;
    /**
     * Get a lesson plan for a class via downloading the file asset.
     * @param {String} instanceId instanceId of the class
     * @returns {Promise<string>}
     */
    getLessonPlan(instanceId: string): Promise<string>;
    /**
     * Gets detailed information about a class.
     * @param {String} instanceId instanceId of the class
     * @param {Boolean} raw raw response from Compass
     * @returns {Promise<Object>} information about the class
     */
    getClassInfo(instanceId: string, raw?: boolean): Promise<any>;
    /**
     * Gets all the locations in the entire school.
     * @param {number} limit limit of objects in the array
     * @returns {Promise<Array<Object>>} an array of objects containing location information.
     */
    getAllLocations(limit: number): Promise<Array<any>>;
    /**
     * Gets all the staff listed in the school.
     * @param {number} limit limit of objects in the array
     * @param {boolean} raw raw response from Compass
     * @returns {Promise<Array<Object>>} an array of objects containing the staff information
     */
    getAllStaff(limit: number, raw?: boolean): Promise<Array<any>>;
    /**
     * Gets the logged-in user's tasks
     * @param {number} limit limit of objects in the array
     * @returns {Promise<Array<Object>>} an array of objects containing task data
     */
    getUserTasks(limit: number): Promise<Array<any>>;
}
