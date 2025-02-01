import { CompassClient } from "../classes/CompassClient";

export interface CompassTerm {
    /**
     * The year of the term.
     */
    year: number | null;
    /**
     * The name of the term
     * @example "Term 1"
     */
    name: string | null;
    /**
     * The start date of the term.
     */
    startDate: Date | null;
    /**
     * The end date of the term.
     */
    endDate: Date | null;
    /**
     * The ID of the term that is represented within Compass.
     */
    id: number | null;
    /**
     * The starting date of the term that is represented within Compass.
     * @example "Thursday, 24 April"
     */
    startDateFormatted: string | null;
}

/**
 * Get all known terms within the institute.
 * @returns {Promise<CompassTerm[]>} An array of terms.
 */
export default async function GetAllTerms(
    this: CompassClient
): Promise<CompassTerm[]> {
    const request = await this.request(
        "/Services/ReferenceDataCache.svc/GetAllTerms?page=1&start=0&limit=100",
        "GET"
    );

    if (!request || !request?.d) {
        throw new Error("Failed to fetch terms within the institute.");
    }

    const terms = request.d;
    const transformed = terms.map(
        (term: any) =>
            ({
                year: !isNaN(parseInt(term?.cy)) ? parseInt(term?.cy) : null,
                name: term?.n ?? null,
                startDate: term?.s ? new Date(term.s) : null,
                endDate: term?.f ? new Date(term.f) : null,
                id: term?.id ?? null,
                startDateFormatted: term?.sl ?? null,
            }) as CompassTerm
    );

    return transformed;
}
