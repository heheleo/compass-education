import { suite } from "uvu";
import * as assert from "uvu/assert";
import { finishEndpointTest, initialise } from "../setup";
import type { CompassCalendarEvent } from "../../src/endpoints/GetCalendarEvents";

const GetCalendarEvents = suite("GetCalendarEvents");
GetCalendarEvents.before(async () => {
    // Check if an instance is already running:
    if (!global.compass) {
        // Launch a new instance:
        await initialise();
    }
});

GetCalendarEvents.after(() => {
    // Finish the endpoint test:
    finishEndpointTest();
});

let response: CompassCalendarEvent[] | null = null;

GetCalendarEvents("Is data returned", async () => {
    response = await global.compass.getCalendarEvents();
    assert.ok(response);
});

// Note: cannot test date options as this might differ across users.

GetCalendarEvents("Is data an array", () => {
    assert.instance(response, Array);
});

GetCalendarEvents.run();
