import { suite } from "uvu";
import * as assert from "uvu/assert";
import type { CompassSubject } from "../../src/endpoints/GetAllSubjects";
import { finishEndpointTest, initialise } from "../setup";

const GetAllSubjects = suite("GetAllSubjects");
GetAllSubjects.before(async () => {
    // Check if an instance is already running:
    if (!global.compass) {
        // Launch a new instance:
        await initialise();
    }
});

GetAllSubjects.after(() => {
    // Finish the endpoint test:
    finishEndpointTest();
});

let response: CompassSubject[] | null = null;

GetAllSubjects("Is data returned", async () => {
    response = await global.compass.getAllSubjects();
    assert.ok(response);
});

GetAllSubjects("Is data an array", () => {
    assert.instance(response, Array);
});

GetAllSubjects.run();
