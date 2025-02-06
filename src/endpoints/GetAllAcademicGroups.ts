import { CompassClient } from "../classes/CompassClient";

export interface CompassAcademicGroup {
    /**
     * The unique identifier of the academic group.
     */
    id: number | null;
    /**
     * The name of the academic group.
     * @example "2022 Academic"
     * @example "2023 Headstart"
     */
    name: string | null;
}

/**
 * Fetches all of the available academic groups within the institution, used
 * within fetching learning tasks.
 * @returns {Promise<CompassAcademicGroup[]>} The academic groups within the
 * institution.
 */
export default async function GetAllAcademicGroups(
    this: CompassClient
): Promise<CompassAcademicGroup[]> {
    const schoolConfigKey = this.schoolConfigKey;
    const request = await this.request(
        `/Services/ReferenceDataCache.svc/GetAllAcademicGroups?sessionstate=readonly&v=${schoolConfigKey}&page=1&start=0&limit=100`,
        "GET"
    );

    if (!request || !request?.d || !Array.isArray(request.d)) {
        throw new Error("Failed to fetch all academic groups within the institute.");
    }

    const groups = request.d;
    const transformed = groups.map(
        (group: any) =>
            ({
                id: group?.id ?? null,
                name: group?.name ?? null,
            }) as CompassAcademicGroup
    );

    return transformed;
}
