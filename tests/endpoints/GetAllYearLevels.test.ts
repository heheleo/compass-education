import { suite } from "uvu";
import * as assert from "uvu/assert";
import type { CompassYearLevel } from "../../src/endpoints/GetAllYearLevels";
import { finishEndpointTest, initialise } from "../setup";

const GetAllYearLevels = suite("GetAllYearLevels");
GetAllYearLevels.before(async () => {
    // Check if an instance is already running:
    if (!global.compass) {
        // Launch a new instance:
        await initialise();
    }
});

GetAllYearLevels.after(() => {
    // Finish the endpoint test:
    finishEndpointTest();
});

let response: CompassYearLevel[] | null = null;

GetAllYearLevels("Is data returned", async () => {
    response = await global.compass.getAllYearLevels();
    assert.ok(response);
});

GetAllYearLevels("Is data an array", () => {
    assert.instance(response, Array);
});

GetAllYearLevels.run();
