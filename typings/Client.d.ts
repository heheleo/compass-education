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
     * Sets the baseURL.
     * @param {String} url the baseURL of the school
     */
    setBaseURL(url: string): void;
    /**
     * Logs the client in, and retrieves a SID.
     * @param {String} username Username of the user
     * @param {String} password Password of the user
     * @returns {Promise<string>} The SID of the user
     */
    login(username: string, password: string): Promise<string>;
    /**
     * Gets the name information, formatted by Compass's backend.
     * @returns {Object} information about the user's name.
     */
    getName(): any;
    /**
     * Gets the classes on a specific date, or today if none provided.
     * @param {Object} options
     * @returns {Array}
     */
    getClasses(dateFrom?: Date, dateTo?: Date, raw?: boolean): any[];
    /**
     * Gets the news feed for an activity.
     * @param {String} activityId activityId of the activity.
     * @param {Object} options
     * @returns {Array}
     */
    getActivityNewsFeed(activityId: string, options?: any): any[];
    /**
     * Get a lesson plan of a class via downloading the file asset.
     * @param {String} instanceId
     */
    getLessonPlan(instanceId: string): Promise<string>;
    /**
     * Gets the detailed information about a class.
     * @param {String} instanceId
     * @param {Boolean} raw
     * @returns {Object} information about the class
     */
    getClassInfo(instanceId: string, raw?: boolean): any;
    /**
     * Gets all the locations in the entire school.
     * @param {Number} limit
     * @returns {Array<Object>} an array of objects containing location information.
     */
    getAllLocations(limit?: number): Array<any>;
    /**
     * Gets all the staff listed in the school.
     * @param {Number} limit
     * @param {Number} raw
     * @returns {Array<Object>} an array of objects containing the staff information
     */
    getAllStaff(limit?: number, raw?: number): Array<any>;
    /**
     * Gets the current user's tasks
     * @param {Number} limit
     * @returns {Array<Object>} an array of objects containing task data
     */
    getUserTasks(limit?: number): Array<any>;
}
