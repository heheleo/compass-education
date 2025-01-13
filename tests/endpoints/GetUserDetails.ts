import { suite } from "uvu";
import * as assert from "uvu/assert";
import { CompassUserDetails } from "../../src/endpoints/GetUserDetails";
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
    const userId = await global.compass.getUserID();
    response = await global.compass.getUserDetails(userId);
    assert.ok(response);
});

GetUserDetails("Is data an object", () => {
    assert.instance(response, Object);
});

GetUserDetails.run();
