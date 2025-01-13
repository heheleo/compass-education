import { suite } from "uvu";
import * as assert from "uvu/assert";
import type { CompassUserDetails } from "../../src/endpoints/GetUserDetails";
import { finishEndpointTest, initialise } from "../setup";

const GetUserDetails = suite("GetUserDetails");
GetUserDetails.before(async () => {
    // Check if an instance is already running:
    if (!global.compass) {
        // Launch a new instance:
        await initialise();
    }
});

GetUserDetails.after(() => {
    // Finish the endpoint test:
    finishEndpointTest();
});

let response: CompassUserDetails | null = null;

GetUserDetails("Is data returned", async () => {
    response = await global.compass.getUserDetails();
    assert.ok(response);
});

GetUserDetails("Is data an object", () => {
    assert.instance(response, Object);
});

GetUserDetails.run();
