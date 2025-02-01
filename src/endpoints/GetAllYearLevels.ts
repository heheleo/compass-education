import { CompassClient } from "../classes/CompassClient";

export interface CompassYearLevel {
    /**
     * The name of the year level.
     * @example "Year 7"
     */
    name: string | null;
    /**
     * The value of the year level that it is represented by.
     * @example 7
     */
    id: number | null;
}

/**
 * Returns all year levels within the institute.
 * @returns {Promise<CompassYearLevel[]>} All known year levels.
 */
export default async function GetAllYearLevels(
    this: CompassClient
): Promise<CompassYearLevel[]> {
    const request = await this.request(
        "/Services/ReferenceDataCache.svc/GetAllYearLevels?sessionstate=readonly&page=1&start=0&limit=100",
        "GET"
    );

    if (!request || !request?.d || !Array.isArray(request.d)) {
        throw new Error("Failed to fetch year levels within the institute.");
    }

    const levels = request.d;
    const transformed = levels.map(
        (level: any) =>
            ({
                name: level?.k ?? null,
                id: level?.v ?? null,
            }) as CompassYearLevel
    );

    return transformed;
}
