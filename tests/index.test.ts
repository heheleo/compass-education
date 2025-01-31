import { suite } from "uvu";
import * as assert from "uvu/assert";
import { initialise } from "./setup";

const Init = suite("Initialisation");
Init.before(async () => {
    // Check if an instance is already running:
    if (!global.compass) {
        // Launch a new instance:
        await initialise();
    }
});

Init("is client present in test environment", () => {
    assert.ok(global.compass);
});

Init.run();
