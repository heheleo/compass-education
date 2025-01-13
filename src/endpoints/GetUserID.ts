/**
 * Note that this is not really considered an endpoint, because it attempts to
 * extract it from the Compass global variable.
 */

import { CompassClient } from "../classes/CompassClient";

/**
 * Returns the user ID of the currently authenticated user.
 * @returns {number} the user ID of the currently authenticated user.
 */
export default async function GetUserID(
    this: CompassClient
): Promise<number> {
	const userId = await this["page"].evaluate("window?.Compass?.organisationUserId");
	if(!Number.isInteger(userId)) {
		throw new Error("Could not find the user ID");
	}

    return userId as number;
}
