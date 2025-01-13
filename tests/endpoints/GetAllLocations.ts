import { suite } from "uvu";
import * as assert from "uvu/assert";
import { CompassLocation } from "../../src/endpoints/GetAllLocations";
import { finishEndpointTest, initialise } from "../setup";

const GetAllLocations = suite("GetAllLocations");
GetAllLocations.before(async () => {
    // Check if an instance is already running:
    if (!global.compass) {
        // Launch a new instance:
        await initialise();
    }
});

GetAllLocations.after(() => {
    // Finish the endpoint test:
    finishEndpointTest();
});

let response: CompassLocation[] | null = null;

GetAllLocations("Is data returned", async () => {
    response = await global.compass.getAllLocations();
    assert.ok(response);
});

GetAllLocations("Is data an array", () => {
	assert.instance(response, Array);
});

GetAllLocations.run();
