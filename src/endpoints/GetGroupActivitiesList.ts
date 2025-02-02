import { CompassClient } from "../classes/CompassClient";

export interface CompassGroupActivity {
    /**
     * The year level of the group activity that it represents.
     * If it is null, it likely applies to all year levels.
     */
    yearLevel: number | null;
    /**
     * The name of the group activity.
     */
    name: string | null;
    /**
     * The ID of the group activity manager.
     */
    managerId: number | null;
    /**
     * The ID of the group activity.
     */
    activityId: number | null;
    /**
     * The ID of the default location. In order to get
     * more information about the location, you will need
     * to use the getAllLocations endpoint and look for
     * the location with the same ID.
     */
    defaultLocationId: number | null;
    /**
     * Whether the group activity is an exam.
     *
     * **Note: this is not always accurate, as school teachers may forget or
     * ignore to label the activity. As a result, do NOT trust this property and
     * use it as an loose indicator.**
     */
    isExam: boolean;
    /**
     * Whether the group activity is a club session.
     *
     * **Note: this is not always accurate, as school teachers may forget or
     * ignore to label the activity. As a result, do NOT trust this property and
     * use it as an loose indicator.**
     */
    isClub: boolean;
    /**
     * Whether the group activity is a meeting.
     *
     * **Note: this is not always accurate, as school teachers may forget or
     * ignore to label the activity. As a result, do NOT trust this property and
     * use it as an loose indicator.**
     */
    isMeeting: boolean;
    /**
     * The start date of the group activity.
     */
    start: Date | null;
    /**
     * The finish date of the group activity.
     */
    finish: Date | null;
}

/**
 * Get a list of all group activities within the institute.
 * This includes exams, clubs, detentions, and meetings, etc.
 * @returns {Promise<CompassGroupActivity[]>} A list of all group activities within the institute.
 */
export default async function GetGroupActivitiesList(
    this: CompassClient
): Promise<CompassGroupActivity[]> {
    const request = await this.request(
        "/Services/Activity.svc/GetGroupActiviesList?sessionstate=readonly",
        "POST",
        {
            page: 1,
            start: 0,
            limit: 25, // This setting has not been tested.
        }
    );

    if (!request || !request?.d) {
        throw new Error(
            "Failed to fetch all group activities within the institute."
        );
    }

    const activities = request.d;
    const transformed = activities.map(
        (activity: any) =>
            ({
                yearLevel: activity?.AcademicYearLevel ?? null,
                name: activity?.ActivityDisplayName ?? null,
                managerId: activity?.ActivityManagerId ?? null,
                activityId: activity?.ActivityId ?? null,
                defaultLocationId: activity?.ActivityDefaultLocationId ?? null,
                isExam: activity?.IsExam ?? null,
                isClub: activity?.IsClub ?? null,
                isMeeting: activity?.IsMeeting ?? null,
                start: activity?.ActivityStart
                    ? new Date(activity.ActivityStart)
                    : null,
                finish: activity?.ActivityFinish
                    ? new Date(activity.ActivityFinish)
                    : null,
            }) as CompassGroupActivity
    );

    return transformed;
}
