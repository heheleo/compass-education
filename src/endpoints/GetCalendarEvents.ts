import { CompassClient } from "../classes/CompassClient";
import { CompassLocation } from "./GetAllLocations";

/**
 * This is not the same as {@link CompassLocation}. It contains less information.
 */
export interface CompassCalendarEventLocation {
    /**
     * The location's ID. You can use {@link CompassClient.getAllLocations} to
     * get more information about the location.
     */
    locationID: number | null;
    /**
     * The name of the location, normally the location code.
     * @example A03, B05 etc.
     */
    locationName: string | null;
}

export interface CompassCalendarEventManager {
    /**
     * The manager's user ID. This is normally not used, as we do not have
     * permission to access manager details.
     */
    managerUserID: number | null;
    /**
     * The manager's identifier, or otherwise known as teacher code.
     * @example JHD (for John Doe)
     */
    managerIdentifier: string | null;
}

export interface CompassCalendarEvent {
    /**
     * Whether the event is an all-day event.
     */
    allDay: boolean | null;
    /**
     * The date the event starts.
     */
    start: Date | null;
    /**
     * The date the event ends.
     */
    end: Date | null;
    /**
     * The location(s) of the event.
     */
    locations: CompassCalendarEventLocation[] | null;
    /**
     * The long title of the event.
     *
     * Note: this may contain HTML tags depending on school. It is up to you to
     * remove it.
     *
     * In the format "time: period - subject title - subject long name -
     * \<s\>teacher identifier\</s\>"
     * @example 10:30: 1 - 3MATA - (Year 3: Mathematics) - A03 - <s>ABC</s>
     */
    longTitle: string | null;
    /**
     * The long title of the event, without the time.
     *
     * Note: this may contain HTML tags depending on school. It is up to you to
     * remove it.
     *
     * In the format "period - subject title - subject long name - \<s\>teacher
     * identifier\</s\>"
     * @example 1 - 3MATA - (Year 3: Mathematics) - A03 - <s>ABC</s>
     */
    longTitleWithoutTime: string | null;
    /**
     * The manager(s) of the event.
     */
    managers: CompassCalendarEventManager[] | null;
    /**
     * The period of the event. This is 1-indexed.
     */
    period: number | null;
    /**
     * Whether the user has been roll marked for the event.
     */
    rollMarked: boolean | null;
    /**
     * The long name of the subject.
     * @example Year 3: Mathematics
     * @example Year 11: Specialist Mathematics - Units 1 & 2
     */
    subjectLongName: string | null;
    /**
     * The title of the subject. Normally the subject code.
     * This will be dependent on the school.
     * @example 3MATA
     */
    subjectTitle: string | null;
}

export interface CompassGetCalendarEventsConfig {
    /**
     * The start date of the events to fetch.
     * If not provided, defaults to today.
     * Must be a string in the form YYYY-MM-DD, or a valid Date.
     */
    startDate?: string | Date;
    /**
     * The end date of the events to fetch.
     * If not provided, defaults to today.
     * Must be a string in the form YYYY-MM-DD, or a valid Date.
     */
    endDate?: string | Date;
    /**
     * The limit number of items to fetch. I would suggest keeping this at 25,
     * which is what the website uses by default, but you may need to increase
     * this if your dates span multiple days.
     *
     * I guess they use MongoDB to store the data, and internally they use the
     * built in query limit functionality or $limit aggregator pipeline.
     * @default 25
     */
    limit?: number;
}

/**
 * Returns the calendar events for the user.
 *
 * If no configuration is provided, it will default to fetching all the events
 * for the current day.
 * @returns {Promise<CompassUserDetails>} the user details
 */
export default async function GetCalendarEvents(
    this: CompassClient,
    config?: CompassGetCalendarEventsConfig
): Promise<CompassCalendarEvent[]> {
    let startDate = config?.startDate ?? new Date();
    let endDate = config?.endDate ?? new Date();
    const limit = config?.limit ?? 25;

    // Cast the dates if needed:
    if (startDate instanceof Date) {
        startDate = startDate.toISOString().split("T")[0];
    }
    if (endDate instanceof Date) {
        endDate = endDate.toISOString().split("T")[0];
    }

    const request = await this.request(
        "Services/Calendar.svc/GetCalendarEventsByUser?sessionstate=readonly&ExcludeNonRelevantPd=true",
        "POST",
        {
            userId: this.userID,
            // This setting does not seem to have any effect, however I may be
            // wrong.
            homePage: true,
            activityId: null,
            locationId: null,
            staffIds: null,
            // Must be in form YYYY-MM-DD
            startDate,
            // Must be in form YYYY-MM-DD
            endDate,
            page: 1,
            start: 0,
            // This may be a dangerous setting.
            limit,
        }
    );

    if (!request || !request?.d) {
        throw new Error("Failed to fetch user details.");
    }

    const data = request.d;
    const transformed: CompassCalendarEvent[] = [];
    for (const event of data) {
        const locations: CompassCalendarEventLocation[] = [];
        for (const location of event?.locations) {
            locations.push({
                locationID: location?.locationID ?? null,
                locationName: location?.locationName ?? null,
            });
        }

        const managers: CompassCalendarEventManager[] = [];
        for (const manager of event?.managers) {
            managers.push({
                managerUserID: manager?.managerUserID ?? null,
                managerIdentifier: manager?.managerImportIdentifier ?? null,
            });
        }

        transformed.push({
            allDay: event?.allDay ?? null,
            start: event?.start ? new Date(event.start) : null,
            end: event?.end ? new Date(event.end) : null,
            locations,
            longTitle: event?.longTitle ?? null,
            longTitleWithoutTime: event?.longTitleWithoutTime ?? null,
            managers: managers,
            period: event?.period ? parseInt(event.period) : null,
            rollMarked: event?.rollMarked ?? null,
            subjectLongName: event?.subjectLongName ?? null,
            subjectTitle: event?.title ?? null,
        });
    }

    return transformed;
}
