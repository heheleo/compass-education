import { CompassClient } from "../classes/CompassClient";

export interface CompassLocation {
    /**
     * Whether the location is archived.
     */
    archived: boolean | null;
    /**
     * The building of the location.
     */
    building: string | null;
    /**
     * The ID of the location.
     */
    id: number | null;
    /**
     * A more verbose name of the location.
     * @example "Court 1"
     */
    longName: string | null;
    /**
     * The name of the location. Normally short and concise.
     * @example "C1"
     */
    name: string | null;
    /**
     * This is likely an exact copy of the name field,
     * however, it is not confirmed.
     */
    roomName: string | null;
}

/**
 * Returns all known locations within the institute.
 * @returns {Promise<CompassLocation[]>} All known locations.
 */
export default async function GetAllLocations(
    this: CompassClient
): Promise<CompassLocation[]> {
    const request = await this.request(
        "/Services/ReferenceDataCache.svc/GetAllLocations",
        "GET"
    );

    if (!request || !request?.d) {
        throw new Error("Failed to fetch locations");
    }

    const locations = request.d;
    const transformed = locations.map(
        (location: any) =>
            ({
                archived: location?.archived ?? null,
                building: location?.building || null,
                id: location?.id ?? null,
                longName: location?.longName ?? null,
                name: location?.n ?? null,
                roomName: location?.roomName ?? null,
            }) as CompassLocation
    );

    return transformed;
}
