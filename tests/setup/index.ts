/**
 * This setup file contains a Compass Client before any test is run.
 * This way, all unit tests can use the same class instance.
 */

import { CompassClient } from "../../src";
import { config } from "dotenv";
import fs from "fs";
import { resolve } from "path";

let totalEndpointTests = -1;

/**
 * This function is used as a call back to run after an endpointtest is run.
 *
 * We track this because we need to close the instance browser after all tests
 * are run.
 */
export function finishEndpointTest() {
    --totalEndpointTests;
    if (totalEndpointTests === 0) {
        // Close the instance:
        if (global.compass["browser"]) global.compass["browser"].close();
    }
}

/**
 * This function is used to initialise an instance of {@link CompassClient}.
 */
export async function initialise() {
    if (totalEndpointTests === -1) {
        // Count the number of endpoint tests:
        totalEndpointTests = await fs.readdirSync(
            resolve(__dirname, "..", "endpoints")
        ).length;
    }

    // Check if an instance is already present:
    if (!global.compass) {
        // Load the environment variables:
        config();

        // Ensure all required environment variables are present:
        if (!process.env.TESTING_BASE_URL) {
            throw new Error(
                "TESTING_BASE_URL environment variable is required for testing."
            );
        }
        if (!process.env.TESTING_USERNAME) {
            throw new Error(
                "TESTING_USERNAME environment variable is required for testing."
            );
        }
        if (!process.env.TESTING_PASSWORD) {
            throw new Error(
                "TESTING_PASSWORD environment variable is required for testing."
            );
        }

        // Create a new instance
        global.compass = new CompassClient(process.env.TESTING_BASE_URL);

        // Logging into Compass. Note that this is not tested explicitly, which
        // will impact test coverage, however I might add an independent test
        // for this in the future.
        await global.compass
            .login({
                username: process.env.TESTING_USERNAME,
                password: process.env.TESTING_PASSWORD,
            })
            .catch((error) => {
                throw new Error(error);
            });
    }
}

declare global {
    var compass: CompassClient;
}
