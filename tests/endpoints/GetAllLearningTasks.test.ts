import { suite } from "uvu";
import * as assert from "uvu/assert";
import type { CompassLearningTask } from "../../src/endpoints/GetAllLearningTasks";
import { finishEndpointTest, initialise } from "../setup";

const GetAllLearningTasks = suite("GetAllLearningTasks");
GetAllLearningTasks.before(async () => {
    // Check if an instance is already running:
    if (!global.compass) {
        // Launch a new instance:
        await initialise();
    }
});

GetAllLearningTasks.after(() => {
    // Finish the endpoint test:
    finishEndpointTest();
});

let response: CompassLearningTask[] | null = null;

GetAllLearningTasks("Is data returned", async () => {
    const academicGroups = await global.compass.getAllAcademicGroups();
    assert.ok(academicGroups);
    const groupId = academicGroups[0].id;
    assert.type(groupId, "number");

    if(!groupId) throw new Error("No academic group ID found");
    response = await global.compass.getAllLearningTasks({
        academicGroupId: groupId,
    });

    assert.ok(response);
});

GetAllLearningTasks("Is data an array", () => {
    assert.instance(response, Array);
});

GetAllLearningTasks.run();
