import { suite } from "uvu";
import * as assert from "uvu/assert";
import type { CompassFeedItem } from "../../src/endpoints/GetFeedITems";
import { finishEndpointTest, initialise } from "../setup";

const GetFeedItems = suite("GetFeedItems");
GetFeedItems.before(async () => {
    // Check if an instance is already running:
    if (!global.compass) {
        // Launch a new instance:
        await initialise();
    }
});

GetFeedItems.after(() => {
    // Finish the endpoint test:
    finishEndpointTest();
});

let response: CompassFeedItem[] | null = null;

GetFeedItems("Is data returned", async () => {
    response = await global.compass.getFeedItems();
    assert.ok(response);
});

GetFeedItems("Is data an array", () => {
    assert.instance(response, Array);
});

GetFeedItems.run();
