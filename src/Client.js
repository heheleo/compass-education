const fetch = require("node-fetch");

const Login = require("./services/Login");
const GetNamesByID = require("./services/GetNamesByID");
const GetCalendarEventsByUser = require("./services/GetCalendarEventsByUser");
const GetActivityNewsFeedPaged = require("./services/GetActivityNewsFeedPaged");
const GetLessonsByInstanceIdQuick = require("./services/GetLessonsByInstanceIdQuick");
const GetAllLocations = require("./services/GetAllLocations");
const GetAllStaff = require("./services/GetAllStaff");
const GetTaskItems = require("./services/GetTaskItems");
const DownloadFile = require("./services/DownloadFile");

/**
 * Starting point for interacting with the client.
 * @class
 */
class Client {
	/**
	 * Constructor of the client.
	 * @param {String} [baseURL] Base URL of your school, can be set via setBaseURL() also
	 */
	constructor(baseURL) {
		this.BASEURL = null;
		this.SID = null;
		this.ALL_COOKIES = null;
		this.USER_ID = null;

		if (baseURL) this.setBaseURL(baseURL);
	}

	/**
	 * Sets the baseURL.
	 * @param {String} url the baseURL of the school
	 */
	setBaseURL(url) {
		if (typeof url !== "string")
			throw new Error("Provided URL is not a string.");

		// Remove scheme
		url = url.replace(/(^\w+:|^)\/\//, "");
		// Remove slashes
		url = url.replace(/\//g, "");

		this.BASEURL = url;
	}

	/**
	 * Logs the client in, and retrieves a SID.
	 * @param {String} username Username of the user
	 * @param {String} password Password of the user
	 * @returns {Promise<string>} The SID of the user
	 */
	async login(username, password) {
		if (this.SID)
			throw new Error("There is already a SID present. Logging in two times in one client is not recommended.");
		if (!username || !password)
			throw new Error("You either did not provide a username or a password while trying to log in.");
		if (this.BASEURL == null)
			throw new Error("The BaseURL of the client is not set. Set it at the constructor or use setBaseURL().");

		const response = await Login(this.BASEURL, username, password);

		// Check if login was successful
		const cookies = response.headers.get("set-cookie").split("; ");
		this.ALL_COOKIES = [...new Set(response.headers.get("set-cookie").split("; "))].join(";");

		let successful = false;

		for (const cookie of cookies) {
			if (cookie.includes("username")) successful = true;
			if (cookie.includes("cpssid")) this.SID = cookie.split("=")[1];
		}

		// Fetch the User ID which is used for every request
		const responseWithRedirects = await fetch(
			new URL(response.headers.get("location"), response.url), 
			{
				method: "GET",
				redirect: "follow",
				headers: {
					cookie: this.ALL_COOKIES
				}
			}
		);

		const html = await responseWithRedirects.text();

		this.USER_ID = html.match(/(Compass.organisationUserId)(.*?)(;$)/gm)[0]
			.replace("Compass.organisationUserId = ", "")
			.replace(";", "");

		if(isNaN(parseInt(this.USER_ID))) {
			// Invalid user id
			this.USER_ID = null;
			throw new Error("Invalid User ID found. This might be because of the school, please submit an issue on GitHub.");
		}
		
		if(successful) {
			return this.SID;
		} else {
			this.SID = null;
			throw new Error("Login attempt failed. This is either because of invalid credentials or base URL.");
		}
	}

	/**
	 * Gets the name information, formatted by Compass's backend.
	 * @returns {Object} information about the user's name.
	 */
	async getName() {
		if(!this.BASEURL || !this.ALL_COOKIES || !this.USER_ID) throw new Error("Client not logged in whilst attempting to use a function.");
		
		const response = await GetNamesByID(this.BASEURL, this.ALL_COOKIES, this.USER_ID)
			.then(res => res.json());	

		if(response.h) return null;

		const name = response["d"][0];
		return {
			name: name.n,
			nameFirstPrefLastIdForm: name.nameFirstPrefLastIdForm,
			namePrefLastId: name.namePrefLastId,
			title: name.title
		};
	}

	/**
	 * Gets the classes on a specific date, or today if none provided.
	 * @param {Date} dateFrom
	 * @param {Date} dateTo
	 * @param {boolean} raw
	 * @returns {Array}
	 */
	async getClasses(
		dateFrom = new Date(),
		dateTo = new Date(),
		raw = false,
	) {
		if(!this.BASEURL || !this.ALL_COOKIES || !this.USER_ID) throw new Error("Client not logged in whilst attempting to use a function.");

		const response = await GetCalendarEventsByUser(
			this.BASEURL,
			this.ALL_COOKIES,
			this.USER_ID,
			dateFrom || new Date(),
			dateTo || new Date()
		).then(res => res.json());
		
		if(response["h"]) return null;

		if(raw) return response["d"];
		else {
			const classes = [];
			response["d"].forEach(cls => {
				const classInfo = cls.longTitleWithoutTime.split(" - ");
				classes.push({
					title: cls.title,
					rollMarked: cls.rollMarked,
					start: cls.start,
					finish: cls.finish,
					activityId: cls.activityId,
					instanceId: cls.instanceId,
					longTitle: cls.longTitle,
					longTitleWithoutTime: cls.longTitleWithoutTime,
					classroom: classInfo[2],
					teacher: classInfo[3],
				});
			});
			classes.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
			return classes;
		}
	}

	/**
	 * Gets the news feed for an activity.
	 * @param {String} activityId activityId of the activity.
	 * @param {Object} options 
	 * @returns {Array}
	 */
	async getActivityNewsFeed(activityId, options = {
		limit: 10,
		raw: false
	}) {
		if(!this.BASEURL || !this.ALL_COOKIES || !this.USER_ID) throw new Error("Client not logged in whilst attempting to use a function.");

		if(!activityId) throw new Error("You did not provide an activityId for getActivityNewsFeed.");

		const response = await GetActivityNewsFeedPaged(
			this.BASEURL, 
			this.ALL_COOKIES, 
			activityId
		).then(res => res.json());

		if(response["h"]) return null;
			
		let toReturn = [];
		if(!options.raw) toReturn = response["d"]["data"];
		else response["d"]["data"].forEach(item => {
			toReturn.push({
				attachments: item.Attachments,
				byAdmin: item.CreatedByAdmin,
				emailSentDate: item.EmailSentDate,
				finish: item.Finish,
				start: item.Start,
				locked: item.Locked,
				priority: item.Priority,
				type: item.CommunicationType,
				newsItemId: item.NewsItemId,
				user: {
					username: item.UserName,
					icon: `https://${this.BASEURL}${item.UserImageUrl}`
				},
				content: {
					title: item.Title,
					contentOne: item.Content1,
					contentTwo: item.content2,
				}
			});
		});

		if(options.limit && !isNaN(options.limit)) return toReturn.slice(0, options.limit);
		else return toReturn;
	}

	/**
	 * Get a lesson plan of a class via downloading the file asset.
	 * @param {String} instanceId 
	 */
	async getLessonPlan(instanceId) {
		if(!this.BASEURL || !this.ALL_COOKIES || !this.USER_ID) throw new Error("Client not logged in whilst attempting to use a function.");

		if(!instanceId) throw new Error("You did not provide an activityID for getLessonPlan.");

		const classInfo = await this.getClassInfo(instanceId);
		if(!classInfo) return null;

		return await DownloadFile(this.BASEURL, this.ALL_COOKIES, classInfo.lessonPlan.assetId).then(res => res.text());
	}

	/**
	 * Gets the detailed information about a class.
	 * @param {String} instanceId 
	 * @param {Boolean} raw 
	 * @returns {Object} information about the class
	 */
	async getClassInfo(instanceId, raw = false) {
		if(!this.BASEURL || !this.ALL_COOKIES || !this.USER_ID) throw new Error("Client not logged in whilst attempting to use a function.");

		if(!instanceId) throw new Error("You did not provide an instanceId for getClassInfo.");

		const response = await GetLessonsByInstanceIdQuick(
			this.BASEURL, 
			this.ALL_COOKIES,
			instanceId
		).then(res => res.json());

		if(response["h"]) return null;
		
		if(raw) return response["d"];
		else return {
			activityDisplayName: response["d"].ActivityDisplayName,
			activityId: response["d"].ActivityId,
			attendees: {
				count: response["d"].AttendeeCount,
				userIdList: response["d"].AttendeeUserIdList
			},
			cover: `https://${this.BASEURL}/${response["d"].CoveringPhotoPath}`,
			location: {
				archived: response["d"].LocationDetails.achived,
				bookable: response["d"].LocationDetails.availableForBooking,
				computers: response["d"].LocationDetails.computerNumber,
				hasCooling: response["d"].LocationDetails.hasCooling,
				hasDvd: response["d"].LocationDetails.hasDvd,
				hasGas: response["d"].LocationDetails.hasGas,
				hasHeating: response["d"].LocationDetails.hasHeating,
				hasProjector: response["d"].LocationDetails.hasProjector,
				hasSmartboard: response["d"].LocationDetails.hasSmartboard,
				hasSoundfield: response["d"].LocationDetails.hasSoundfield,
				hasSpeakers: response["d"].LocationDetails.hasSpeakers,
				hasTv: response["d"].LocationDetails.hasTv,
				hasWater: response["d"].LocationDetails.hasWater,
				hasWheelchair: response["d"].LocationDetails.hasWheelchair,
				name: response["d"].LocationDetails.longName,
				id: response["d"].LocationId
			},
			teacher: {
				username: response["d"].ManagerTextReadable,
				icon: `https://${this.BASEURL}/${response["d"].ManagerPhotoPath}`,
				id: response["d"].mi
			},
			subjectName: response["d"].SubjectName,
			subjectId: response["d"].SubjectId,
			lessonPlan: {
				assetId: response["d"].lp.fileAssetId,
				assetName: response["d"].lp.name
			}
		};	
	}
	
	/**
	 * Gets all the locations in the entire school.
	 * @param {Number} limit 
	 * @returns {Array<Object>} an array of objects containing location information.
	 */
	async getAllLocations(limit) {
		if(!this.BASEURL || !this.ALL_COOKIES || !this.USER_ID) throw new Error("Client not logged in whilst attempting to use a function.");

		const response = await GetAllLocations(this.BASEURL, this.ALL_COOKIES)
			.then(res => res.json());
		
		if(response["h"]) return null;

		const toReturn = [];
		response["d"].forEach(location => {
			toReturn.push({
				archived: location.archived,
				building: location.building,
				id: location.id,
				longName: location.longName,
				name: location.roomName
			});
		});

		if(limit && !isNaN(limit)) return toReturn.slice(0, limit);
		else return toReturn;
	}

	/**
	 * Gets all the staff listed in the school.
	 * @param {Number} limit 
	 * @param {boolean} raw 
	 * @returns {Array<Object>} an array of objects containing the staff information
	 */
	async getAllStaff(limit, raw = false) {
		if(!this.BASEURL || !this.ALL_COOKIES || !this.USER_ID) throw new Error("Client not logged in whilst attempting to use a function.");

		const response = await GetAllStaff(this.BASEURL, this.ALL_COOKIES)
			.then(res => res.json());
			
		if(response["h"]) return null;

		let toReturn = [];
		if(raw) toReturn = response["d"];
		else response["d"].forEach(staff => {
			toReturn.push({
				email: staff.ce,
				id: staff.id,
				name: staff.n,
				staffId: staff.li,
				start: staff.start,
				mobileNumber: staff.mobileNumber,
				displayCode: staff.displayCode
			});
		});

		if(limit && !isNaN(limit)) return toReturn.slice(0, limit);
		else return toReturn;
	} 

	/**
	 * Gets the current user's tasks
	 * @param {Number} limit 
	 * @returns {Array<Object>} an array of objects containing task data
	 */
	async getUserTasks(limit) {
		if(!this.BASEURL || !this.ALL_COOKIES || !this.USER_ID) throw new Error("Client not logged in whilst attempting to use a function.");

		const response = await GetTaskItems(this.BASEURL, this.ALL_COOKIES)
			.then(res => res.json());
			
		if(response["h"]) return null;

		const toReturn = [];
		response["d"].forEach(task => {
			toReturn.push({
				due: task.dueDate,
				id: task.id,
				name: task.taskName,
				completed: task.status
			});
		});

		if(limit && !isNaN(limit)) return toReturn.slice(0, limit);
		else return toReturn;
	}
}

module.exports = Client;
