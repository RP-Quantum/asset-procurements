import { NotFoundError } from "~~/server/utils/error";

export class AssetRepairNotFoundError extends NotFoundError {
	constructor(assetRepairId: string) {
		super({
			name: "AssetRepairNotFoundError",
			message: `AssetRepair with ID ${assetRepairId} not found.`,
		});
	}
}
