import { CompassClient } from "../classes/CompassClient";

export interface CompassUserDetails {
    /**
     * An expanded string that describes the age of the user.
     * @example "62 years, 3 months"
     */
    verboseAge: string | null;
    /**
     * The date of birth of the user. Note that this could change in the future,
     * hence I did not use the `Date` object. However, the examples currently
     * can be parsed easily, using `new Date(birthday)`.
     * @example "10 Jan 1940"
     */
    birthday: string | null;
    /**
     * The gender of the user.
     */
    gender: string | null | null;
    /**
     * The Compass ID of the user.
     */
    compassID: string | null;
    /**
     * The code of the user. This is likely a unique identifier within the school.
     * @example "ABC-0000"
     */
    displayCode: string | null;
    /**
     * The email of the user.
     */
    email: string | null;
    /**
     * The first name of the user.
     * @example "John"
     */
    firstName: string | null;
    /**
     * The form group of the user.
     */
    formGroup: string | null;
    /**
     * The full name of the user. Note that this includes the preferred name.
     * @example John (Johnny) Doe
     */
    fullName: string | null;
    /**
     * The last name of the user.
     * @example "Doe"
     */
    lastName: string | null;
    /**
     * The house of the user.
     */
    house: string | null;
    /**
     * The URL that leads to the user's photo.
     */
    photoURL: string | null;
    /**
     * The preferred name of the user.
     * @example "Johnny"
     */
    preferredName: string | null;
    /**
     * The preferred last name of the user.
     * @example "Doe"
     */
    preferredLastName: string | null;
    /**
     * The year level of the user.
     * @example 8
     */
    yearLevel: number | null;
}

/**
 * Returns user details for the currently authenticated user.
 * @returns {Promise<CompassUserDetails>} the user details
 */
export default async function GetAllLocations(
    this: CompassClient,
): Promise<CompassUserDetails> {
    const request = await this.request(
        "/Services/User.svc/GetUserDetailsBlobByUserId",
        "POST",
        {
            targetUserId: this.userID,
        }
    );

    if (!request || !request?.d) {
        throw new Error("Failed to fetch user details.");
    }

    const info = request.d;
    const transformed: CompassUserDetails = {
        verboseAge: info?.age,
        birthday: info?.birthday,
        gender: info?.gender,
        compassID: info?.userCompassPersonId,
        displayCode: info?.userDisplayCode,
        email: info?.userEmail,
        firstName: info?.userFirstName,
        formGroup: info?.userFormGroup,
        fullName: info?.userFullName,
        lastName: info?.userLastName,
        house: info?.userHouse,
        photoURL: info?.userPhotoPath
            ? new URL(info?.userPhotoPath, this.baseURL).toString()
            : null,
        preferredName: info?.userPreferredName,
        preferredLastName: info?.userPreferredLastName,
        yearLevel: info?.userYearLevelId,
    };

    return transformed;
}
