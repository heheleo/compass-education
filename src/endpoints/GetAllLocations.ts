import CompassClient from "../classes/CompassClient";

export interface CompassLocation {
    /**
     * The type of the location.
     * All possible values of this field have not been researched yet,
     * and the meaning may also vary.
     */
    __type: string;
    /**
     * Whether the location is archived.
     */
    archived: boolean;
    /**
     * The building of the location.
     */
    building: string | null;
    /**
     * The ID of the location.
     */
    id: number;
    /**
     * A more verbose name of the location.
     * @example "Court 1"
     */
    longName: string;
    /**
     * The name of the location. Normally short and concise.
     * @example "C1"
     */
    name: string;
    /**
     * This is likely an exact copy of the name field,
     * however, it is not confirmed.
     */
    roomName: string;
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
                __type: location?.__type,
                archived: location?.archived,
                building: location?.building || null,
                id: location?.id,
                longName: location?.longName,
                name: location?.n,
                roomName: location?.roomName,
            }) as CompassLocation
    );

    return transformed;
}
