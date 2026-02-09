import type { PrismaClient } from "#shared/generated/prisma/client";
import type { CreateAssetDTO, UpdateAssetDTO } from "#shared/modules/asset";
import type { PaginationDTO, SearchDTO } from "#shared/schemas";
import {
	AssetConstrainedWithAssetRepairsError,
	AssetNotFoundError,
	assetInclude,
	buildAssetSearchFilter,
} from "~~/server/modules/asset";
import { DepartmentNotFoundError } from "~~/server/modules/department";

export class AssetService {
	constructor(private readonly prisma: PrismaClient) {}

	async getAssets(
		config?: PaginationDTO & SearchDTO,
	): Promise<AssetWithRelations[]> {
		const { page, perPage, search } = config || {};

		const take = perPage;
		const skip = page && perPage ? (page - 1) * perPage : undefined;
		const where = buildAssetSearchFilter(search);

		return this.prisma.asset.findMany({
			take,
			skip,
			where,
			include: assetInclude,
		});
	}
	async getAssetById(id: string): Promise<AssetWithRelations> {
		const asset = await this.prisma.asset.findUnique({
			where: { id },
			include: assetInclude,
		});
		if (!asset) {
			throw new AssetNotFoundError(id);
		}
		return asset;
	}

	async countAssets(config?: SearchDTO): Promise<number> {
		const { search } = config || {};

		const where = buildAssetSearchFilter(search);

		return this.prisma.asset.count({ where });
	}

	async createAsset(data: CreateAssetDTO): Promise<AssetWithRelations> {
		await this.checkDepartmentExists(data.departmentId);

		return this.prisma.asset.create({
			data,
			include: assetInclude,
		});
	}

	async updateAsset(
		id: string,
		data: UpdateAssetDTO,
	): Promise<AssetWithRelations> {
		await this.getAssetById(id);

		if (data.departmentId) {
			await this.checkDepartmentExists(data.departmentId);
		}

		return this.prisma.asset.update({
			where: { id },
			data,
			include: assetInclude,
		});
	}

	async deleteAsset(id: string): Promise<AssetWithRelations> {
		await this.getAssetById(id);
		await this.checkNoAssetRepairsExist(id);

		return this.prisma.asset.delete({
			where: { id },
			include: assetInclude,
		});
	}

	private async checkDepartmentExists(departmentId: string): Promise<void> {
		const department = await this.prisma.department.findUnique({
			where: { id: departmentId },
		});

		if (!department) {
			throw new DepartmentNotFoundError(departmentId);
		}
	}

	private async checkNoAssetRepairsExist(assetId: string): Promise<void> {
		const assetRepairs = await this.prisma.assetRepair.count({
			where: { assetId },
		});

		if (assetRepairs > 0) {
			throw new AssetConstrainedWithAssetRepairsError(assetId);
		}
	}
}

export function useAssetService(prisma: PrismaClient): AssetService {
	return new AssetService(prisma);
}
