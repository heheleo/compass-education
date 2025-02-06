import { CompassClient } from "../classes/CompassClient";

export interface CompassStaff {
    /**
     * A unique identifier for the staff member.
     */
    id: number | null
    /**
     * The display code of the staff member.
     * @example "JHD"
     */
    displayCode: string | null;
    /**
     * Which campus ID the staff member is located at.
     */
    campusId: number | null;
    /**
     * The first name of the staff member.
     */
    firstName: string | null;
    /**
     * The last name of the staff member.
     */
    lastName: string | null;
    /**
     * The full name of the staff member.
     * Note that the last name is capitalised.
     * @example "John DOE"
     */
    fullName: string | null;
    /**
     * When the staff member joined the institute.
     */
    joinDate: Date | null;
}

/**
 * Returns all known staff members within the institute.
 * @returns {Promise<CompassStaff[]>} All known staff members.
 */
export default async function GetAllStaff(
    this: CompassClient
): Promise<CompassStaff[]> {
    const request = await this.request(
        "/Services/User.svc/GetAllStaff?sessionstate=readonly",
        "POST",
        {
            page: 1,
            start: 0,
            // I do not think that the limit makes a difference, through
            // testing. As a result, it is not exposed as a configurable
            // parameter.
            limit: 25,
        }
    );

    if (!request || !request?.d) {
        throw new Error("Failed to fetch all staff members.");
    }

    const staffMembers = request.d;
    const transformed = staffMembers.map(
        (staffMember: any) =>
            ({
                id: staffMember?.id ?? null,
                displayCode: staffMember?.displayCode ?? null,
                campusId: staffMember?.campusId ?? null,
                firstName: staffMember?.fn ?? null,
                lastName: staffMember?.ln ?? null,
                fullName: staffMember?.n ?? null,
                joinDate: staffMember?.start
                    ? new Date(staffMember.start)
                    : null,
            }) as CompassStaff
    );

    return transformed;
}
