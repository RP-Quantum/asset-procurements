import type { PrismaClient } from "#shared/generated/prisma/client";
import type {
	CreateAssetRepairDTO,
	UpdateAssetRepairDTO,
} from "#shared/modules/asset-repair/schema";
import { AssetRepairNotFoundError } from "~~/server/modules/asset-repair/error";
import {
	assetRepairInclude,
	buildAssetRepairSearchFilter,
} from "~~/server/modules/asset-repair/util";
import { AssetNotFoundError } from "~~/server/modules/asset/error";
import type { PaginationDTO, SearchDTO } from "#shared/schemas/request";

export class AssetRepairService {
	constructor(private readonly prisma: PrismaClient) {}

	async getAssetRepairs(
		config?: PaginationDTO & SearchDTO,
	): Promise<AssetRepairWithRelations[]> {
		const { page, perPage, search } = config || {};

		const take = perPage;
		const skip = page && perPage ? (page - 1) * perPage : undefined;
		const where = buildAssetRepairSearchFilter(search);

		return this.prisma.assetRepair.findMany({
			take,
			skip,
			where,
			include: assetRepairInclude,
		});
	}

	async getAssetRepairById(id: string): Promise<AssetRepairWithRelations> {
		const assetRepair = await this.prisma.assetRepair.findUnique({
			where: { id },
			include: assetRepairInclude,
		});

		if (!assetRepair) {
			throw new AssetRepairNotFoundError(id);
		}

		return assetRepair;
	}

	async countAssetRepairs(config?: SearchDTO): Promise<number> {
		const { search } = config || {};

		const where = buildAssetRepairSearchFilter(search);

		return this.prisma.assetRepair.count({ where });
	}

	async createAssetRepair(
		data: CreateAssetRepairDTO,
	): Promise<AssetRepairWithRelations> {
		await this.validateAssetExistence(data.assetId);

		return this.prisma.assetRepair.create({
			data,
			include: assetRepairInclude,
		});
	}

	async updateAssetRepair(
		id: string,
		data: UpdateAssetRepairDTO,
	): Promise<AssetRepairWithRelations> {
		await this.getAssetRepairById(id);

		return this.prisma.assetRepair.update({
			where: { id },
			data,
			include: assetRepairInclude,
		});
	}

	async deleteAssetRepair(id: string): Promise<AssetRepairWithRelations> {
		await this.getAssetRepairById(id);

		return this.prisma.assetRepair.delete({
			where: { id },
			include: assetRepairInclude,
		});
	}

	private async validateAssetExistence(assetId: string): Promise<void> {
		const asset = await this.prisma.asset.findUnique({
			where: { id: assetId },
		});

		if (!asset) {
			throw new AssetNotFoundError(assetId);
		}
	}
}

export function useAssetRepairService(
	prisma: PrismaClient,
): AssetRepairService {
	return new AssetRepairService(prisma);
}
