import { suite } from "uvu";
import * as assert from "uvu/assert";
import type { CompassGroupActivity } from "../../src/endpoints/GetGroupActivitiesList";
import { finishEndpointTest, initialise } from "../setup";

const GetGroupActivitiesList = suite("GetGroupActivitiesList");
GetGroupActivitiesList.before(async () => {
    // Check if an instance is already running:
    if (!global.compass) {
        // Launch a new instance:
        await initialise();
    }
});

GetGroupActivitiesList.after(() => {
    // Finish the endpoint test:
    finishEndpointTest();
});

let response: CompassGroupActivity[] | null = null;

GetGroupActivitiesList("Is data returned", async () => {
    response = await global.compass.getGroupActivitiesList();
    assert.ok(response);
});

GetGroupActivitiesList("Is data an array", () => {
    assert.instance(response, Array);
});

GetGroupActivitiesList.run();
