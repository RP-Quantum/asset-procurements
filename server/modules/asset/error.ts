import { NotFoundError, ConflictError } from "~~/server/utils/error";

export class AssetNotFoundError extends NotFoundError {
	constructor(assetId: string) {
		super({
			name: "AssetNotFoundError",
			message: `Asset with ID ${assetId} not found.`,
		});
	}
}

export class AssetConstrainedWithAssetRepairsError extends ConflictError {
	constructor(assetId: string) {
		super({
			name: "AssetConstrainedWithAssetRepairsError",
			message: `Asset with ID ${assetId} cannot be deleted because it has associated asset repairs.`,
		});
	}
}
