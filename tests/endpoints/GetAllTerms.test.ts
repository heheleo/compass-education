import { suite } from "uvu";
import * as assert from "uvu/assert";
import type { CompassTerm } from "../../src/endpoints/GetAllTerms";
import { finishEndpointTest, initialise } from "../setup";

const GetAllTerms = suite("GetAllTerms");
GetAllTerms.before(async () => {
    // Check if an instance is already running:
    if (!global.compass) {
        // Launch a new instance:
        await initialise();
    }
});

GetAllTerms.after(() => {
    // Finish the endpoint test:
    finishEndpointTest();
});

let response: CompassTerm[] | null = null;

GetAllTerms("Is data returned", async () => {
    response = await global.compass.getAllTerms();
    assert.ok(response);
});

GetAllTerms("Is data an array", () => {
    assert.instance(response, Array);
});

GetAllTerms.run();
