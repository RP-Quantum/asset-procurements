import { NotFoundError } from "~~/server/utils/error";

export class LocationNotFoundError extends NotFoundError {
	constructor(locationId: string) {
		super({
			name: "LocationNotFoundError",
			message: `Location with ID ${locationId} not found.`,
		});
	}
}
