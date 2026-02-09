import type { PrismaClient, Location } from "#shared/generated/prisma/client";
import { LocationNotFoundError } from "~~/server/modules/location/error";

export class LocationService {
	constructor(private readonly prisma: PrismaClient) {}

	async getAllLocations(): Promise<Location[]> {
		return this.prisma.location.findMany();
	}

	async getLocationById(id: string): Promise<Location | null> {
		const location = await this.prisma.location.findUnique({
			where: { id },
		});

		if (!location) {
			throw new LocationNotFoundError(id);
		}

		return location;
	}

	async countAllLocations(): Promise<number> {
		return this.prisma.location.count();
	}
}

export function useLocationService(prisma: PrismaClient): LocationService {
	return new LocationService(prisma);
}
