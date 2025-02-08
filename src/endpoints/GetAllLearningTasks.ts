import { CompassClient } from "../classes/CompassClient";

export interface CompassLearningTaskGradingItem {
    /**
     * The ID of the grading item.
     */
    id: number;
    /**
     * Whether the grading item is reflected in the semester report.
     */
    includeInSemesterReport?: boolean;
    /**
     * The name of the grading item.
     * @example "Percentage" "Comment"
     */
    name: string;
}

export interface CompassLearningTaskResult {
    /**
     * The ID of the result
     */
    id: number;
    /**
     * The result of the grading item.
     */
    result: number;
    /**
     * When the result was submitted.
     */
    modifiedTimestamp?: Date;
}

export interface CompassLearningTask {
    /**
     * The name of the learning task.
     * @example "Chemistry Test"
     */
    name: string;
    /**
     * The description of the learning task. Note that this is in HTML. You may
     * want to use a HTML library like `cheerio` to parse and manipulate this.
     */
    description: string;
    /**
     * The group that the learning task is directed to.
     * @example "CHEM4"
     */
    groupName?: string;
    /**
     * The unique ID of the learning task.
     */
    id: number;
    /**
     * Whether the learning task is marked as important. Note that this does not
     * accurately reflect the importance of the task, as teachers can mark tasks
     * as important for various reasons.
     */
    important?: boolean;
    /**
     * When the learning task was created.
     */
    startDate?: Date;
    /**
     * When the learning task is due.
     */
    dueDate?: Date;
    /**
     * The grading items for the learning task. This is crucial in understanding
     * the results.
     */
    gradingItems: CompassLearningTaskGradingItem[];
    /**
     * The results of the learning task. This is an array which maps to each grading
     * item. For example, if the grading items are "Percentage" and "Comment", then
     * the results will be the percentage and the comment.
     */
    results: CompassLearningTaskResult[];
    /**
     * When the learning task was submitted, if applicable.
     */
    submittedTimestamp?: Date;
    /**
     * The subject name of the learning task.
     */
    subjectName?: string;
}

interface CompassGetAllLearningTasksConfig {
    /**
     * The academic group ID to fetch learning tasks from.
     * This can be fetched using {@link CompassClient.getAllAcademicGroups}.
     */
    academicGroupId?: number;
    /**
     * The maximum number of learning tasks to fetch.
     * @default 500
     */
    limit?: number;
}

/**
 * Fetches all learning tasks for the user. This includes assignments, tests, homework, etc.
 * Requires a valid academic group ID, which can be fetched using {@link CompassClient.getAllAcademicGroups}.
 * @returns {Promise<CompassLearningTask[]>} An array of learning tasks.
 */
export default async function GetAllLearningTasks(
    this: CompassClient,
    config?: CompassGetAllLearningTasksConfig
): Promise<CompassLearningTask[]> {
    // Check if the academic group ID is provided:
    if (!config?.academicGroupId) {
        throw new Error(
            "Academic group ID is required to fetch learning tasks."
        );
    }

    const request = await this.request(
        "/Services/LearningTasks.svc/GetAllLearningTasksByUserId?sessionstate=readonly",
        "POST",
        {
            academicGroupId: config.academicGroupId,
            userId: this.userID,
            showHiddenTasks: true,
            page: 1,
            start: 0,
            limit: config.limit ?? 500,
            // TODO: Investigate sorting. However, sorting doesn't matter as the
            // user just needs the tasks, and they can sort it themselves.
            sort: '[{"property":"groupName","direction":"ASC"},{"property":"dueDateTimestamp","direction":"DESC"}]',
        }
    );

    if (
        !request ||
        !request?.d ||
        !request?.d?.data ||
        !Array.isArray(request.d.data)
    ) {
        throw new Error("Failed to fetch learning tasks for the user.");
    }

    const learningTasks = request.d.data;
    const transformed = learningTasks.map(
        (task: any) => ({
            name: task.name,
            description: task.description,
            groupName: task.groupName,
            id: task.id,
            important: task.important,
            startDate: task.activityStart ? new Date(task.activityStart) : undefined,
            dueDate: task.dueDateTimestamp ? new Date(task.dueDateTimestamp) : undefined,
            gradingItems: task.gradingItems.map(
                (item: any) =>
                    ({
                        id: item.id,
                        includeInSemesterReport: item?.includeInSemesterReport ?? null,
                        name: item.name,
                    }) as CompassLearningTaskGradingItem
            ),
            results: task?.students?.[0]?.results?.map(
                (result: any) =>
                    ({
                        id: result.id,
                        result: result.result,
                        modifiedTimestamp: result.modifiedTimestamp
                            ? new Date(result.modifiedTimestamp)
                            : undefined,
                    }) as CompassLearningTaskResult
            ),
            submittedTimestamp: task.submittedTimestamp
                ? new Date(task.submittedTimestamp)
                : undefined,
            subjectName: task.subjectName,
        }) as CompassLearningTask
    );

    return transformed;
}
