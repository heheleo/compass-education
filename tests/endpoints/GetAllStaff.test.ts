import { suite } from "uvu";
import * as assert from "uvu/assert";
import type { CompassStaff } from "../../src/endpoints/GetAllStaff";
import { finishEndpointTest, initialise } from "../setup";

const GetAllStaff = suite("GetAllStaff");
GetAllStaff.before(async () => {
    // Check if an instance is already running:
    if (!global.compass) {
        // Launch a new instance:
        await initialise();
    }
});

GetAllStaff.after(() => {
    // Finish the endpoint test:
    finishEndpointTest();
});

let response: CompassStaff[] | null = null;

GetAllStaff("Is data returned", async () => {
    response = await global.compass.getAllStaff();
    assert.ok(response);
});

GetAllStaff("Is data an array", () => {
    assert.instance(response, Array);
});

GetAllStaff.run();
