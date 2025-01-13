import { suite } from "uvu";
import * as assert from "uvu/assert";
import { finishEndpointTest, initialise } from "../setup";

const GetUserID = suite("GetUserID");
GetUserID.before(async () => {
    // Check if an instance is already running:
    if (!global.compass) {
        // Launch a new instance:
        await initialise();
    }
});

GetUserID.after(() => {
    // Finish the endpoint test:
    finishEndpointTest();
});

let response: number | null = null;

GetUserID("Is data returned", async () => {
    response = await global.compass.getUserID();
    assert.ok(response);
});

GetUserID("Is data a valid integer", () => {
    assert.type(response, "number");
});

GetUserID.run();
