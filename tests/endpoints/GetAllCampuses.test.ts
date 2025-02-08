import { suite } from "uvu";
import * as assert from "uvu/assert";
import { finishEndpointTest, initialise } from "../setup";
import type { CompassCampus } from "../../src/endpoints/GetAllCampuses";

const GetAllCampuses = suite("GetAllCampuses");
GetAllCampuses.before(async () => {
    // Check if an instance is already running:
    if (!global.compass) {
        // Launch a new instance:
        await initialise();
    }
});

GetAllCampuses.after(() => {
    // Finish the endpoint test:
    finishEndpointTest();
});

let response: CompassCampus[] | null = null;

GetAllCampuses("Is data returned", async () => {
    response = await global.compass.getAllCampuses();
    assert.ok(response);
});

GetAllCampuses("Is data an array", () => {
    assert.instance(response, Array);
});

GetAllCampuses.run();
