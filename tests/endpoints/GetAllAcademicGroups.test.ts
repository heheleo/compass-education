import { suite } from "uvu";
import * as assert from "uvu/assert";
import { finishEndpointTest, initialise } from "../setup";
import type { CompassAcademicGroup } from "../../src/endpoints/GetAllAcademicGroups";

const GetAllAcademicGroups = suite("GetAllAcademicGroups");
GetAllAcademicGroups.before(async () => {
    // Check if an instance is already running:
    if (!global.compass) {
        // Launch a new instance:
        await initialise();
    }
});

GetAllAcademicGroups.after(() => {
    // Finish the endpoint test:
    finishEndpointTest();
});

let response: CompassAcademicGroup[] | null = null;

GetAllAcademicGroups("Is data returned", async () => {
    response = await global.compass.getAllAcademicGroups();
    assert.ok(response);
});

GetAllAcademicGroups("Is data an array", () => {
    assert.instance(response, Array);
});

GetAllAcademicGroups.run();
