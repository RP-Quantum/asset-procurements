import type { PrismaClient, Prisma } from "#shared/generated/prisma/client";
import type {
	CreateAssetProcurementDTO,
	UpdateAssetProcurementDTO,
} from "#shared/modules/asset-procurement/schema";
import { AssetProcurementNotFoundError } from "~~/server/modules/asset-procurement/error";
import {
	assetProcurementInclude,
	buildAssetProcurementSearchFilter,
} from "~~/server/modules/asset-procurement/util";
import { AssetRepairNotFoundError } from "~~/server/modules/asset-repair/error";
import type { PaginationDTO, SearchDTO } from "#shared/schemas/request";

export class AssetProcurementService {
	constructor(private readonly prisma: PrismaClient) {}

	async getAssetProcurements(
		config?: PaginationDTO & SearchDTO,
	): Promise<AssetProcurementWithRelations[]> {
		const { page, perPage, search } = config || {};

		const take = perPage;
		const skip = page && perPage ? (page - 1) * perPage : undefined;
		const where = buildAssetProcurementSearchFilter(search);

		return this.prisma.assetProcurement.findMany({
			take,
			skip,
			where,
			include: assetProcurementInclude,
		});
	}

	async getAssetProcurementById(
		id: string,
	): Promise<AssetProcurementWithRelations> {
		const assetProcurement = await this.prisma.assetProcurement.findUnique({
			where: { id },
			include: assetProcurementInclude,
		});

		if (!assetProcurement) {
			throw new AssetProcurementNotFoundError(id);
		}

		return assetProcurement;
	}

	async countAssetProcurements(config?: SearchDTO): Promise<number> {
		const { search } = config || {};

		const where = buildAssetProcurementSearchFilter(search);

		return this.prisma.assetProcurement.count({ where });
	}

	async createAssetProcurement(
		data: CreateAssetProcurementDTO,
	): Promise<AssetProcurementWithRelations> {
		await this.validateAssetRepairExistence(data.repairId);

		const created = await this.prisma.assetProcurement.create({
			data: {
				repairId: data.repairId,
				data: data.data as Prisma.InputJsonValue,
			},
			include: assetProcurementInclude,
		});

		return created as AssetProcurementWithRelations;
	}

	async updateAssetProcurement(
		id: string,
		data: UpdateAssetProcurementDTO,
	): Promise<AssetProcurementWithRelations> {
		await this.getAssetProcurementById(id);

		const updated = await this.prisma.assetProcurement.update({
			where: { id },
			data: {
				...(data.data !== undefined && {
					data: data.data as Prisma.InputJsonValue,
				}),
			},
			include: assetProcurementInclude,
		});

		return updated as AssetProcurementWithRelations;
	}

	async deleteAssetProcurement(
		id: string,
	): Promise<AssetProcurementWithRelations> {
		await this.getAssetProcurementById(id);

		return this.prisma.assetProcurement.delete({
			where: { id },
			include: assetProcurementInclude,
		});
	}

	private async validateAssetRepairExistence(repairId: string): Promise<void> {
		const repair = await this.prisma.assetRepair.findUnique({
			where: { id: repairId },
		});

		if (!repair) {
			throw new AssetRepairNotFoundError(repairId);
		}
	}
}

export function useAssetProcurementService(
	prisma: PrismaClient,
): AssetProcurementService {
	return new AssetProcurementService(prisma);
}
