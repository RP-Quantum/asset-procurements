import { NotFoundError } from "~~/server/utils/error";

export class AssetProcurementNotFoundError extends NotFoundError {
	constructor(assetProcurementId: string) {
		super({
			name: "AssetProcurementNotFoundError",
			message: `AssetProcurement with ID ${assetProcurementId} not found.`,
		});
	}
}
