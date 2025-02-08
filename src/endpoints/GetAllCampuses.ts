import { CompassClient } from "../classes/CompassClient";

export interface CompassCampus {
    /**
     * The name of the campus.
     */
    name: string;
    /**
     * The name of the institute that the campus belongs to.
     */
    instituteName: string;
    /**
     * Whether the campus is marked as active.
     */
    active: boolean;
    /**
     * Whether the campus is archived.
     */
    archived: boolean;
    /**
     * Whether the campus is the default campus.
     * @example true
     */
    defaultCampus: boolean;
    /**
     * The UUID of the campus
     * @example "00000000-0000-0000-0000-000000000000"
     */
    uuid: string;
    /**
     * The ID of the campus.
     */
    id: number;
}

/**
 * Retrieves all campuses from the institute.
 * @returns {Promise<CompassCampus[]>} All campuses within the institute.
 */
export default async function GetAllCampuses(
    this: CompassClient
): Promise<CompassCampus[]> {
    const request = await this.request(
        `/Services/ReferenceDataCache.svc/GetAllCampuses?sessionstate=readonly&v=${this.schoolConfigKey}&page=1&start=0&limit=100`,
        "GET"
    );

    if (!request || !request?.d || !Array.isArray(request.d)) {
        throw new Error("Failed to fetch all institute campuses");
    }

    const campuses = request.d;
    const transformed = campuses.map(
        (campus: any) =>
            ({
                name: campus?.campusName,
                instituteName: campus?.name,
                active: !!campus?.active,
                archived: !!campus?.archived,
                defaultCampus: campus?.defaultCampus,
                uuid: campus?.campusGuid,
                id: campus?.campusId,
            }) as CompassCampus
    );

    return transformed;
}
