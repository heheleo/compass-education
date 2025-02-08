import { CompassClient } from "../classes/CompassClient";

export interface CompassSubject {
    /**
     * The name of the subject.
     */
    name: string;
    /**
     * The IDs of the teachers that teach the subject.
     */
    teacherIds: number[];
}

/**
 * Retrieves all subjects that the user takes.
 * @returns {Promise<CompassSubject[]>} all the subjects that the user takes.
 */
export default async function GetAllSubjects(
    this: CompassClient
): Promise<CompassSubject[]> {
    const request = await this.request(
        "/Services/Communications.svc/GetClassTeacherDetailsByStudent",
        "POST",
        {
            userId: this.userID,
        }
    );

    if (!request || !request?.d || !Array.isArray(request.d)) {
        throw new Error("Failed to fetch subjects for the user.");
    }

    const subjects = request.d;
    const transformed = subjects.map(
        (subject: any) =>
            ({
                name: subject?.subjectName,
                teacherIds: subject?.ids,
            }) as CompassSubject
    );

    return transformed;
}
