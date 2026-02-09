import type { $Fetch } from "nitropack";
import type {
	CreateAssetProcurementDTO,
	UpdateAssetProcurementDTO,
} from "#shared/modules/asset-procurement";

export class AssetProcurementService {
	constructor(private readonly apiFetch: $Fetch) {}

	async getAssetProcurements() {
		return this.apiFetch("/api/asset-procurements");
	}

	async getAssetProcurementById(id: string) {
		return this.apiFetch(`/api/asset-procurements/${id}`);
	}

	async countAssetProcurements() {
		return this.apiFetch<number>("/api/asset-procurements/count");
	}

	async createAssetProcurement(data: CreateAssetProcurementDTO) {
		return this.apiFetch("/api/asset-procurements", {
			method: "POST",
			body: data,
		});
	}

	async updateAssetProcurement(id: string, data: UpdateAssetProcurementDTO) {
		return this.apiFetch(
			`/api/asset-procurements/${id}` as "/api/asset-procurements/:id",
			{
				method: "PATCH",
				body: data,
			},
		);
	}

	async deleteAssetProcurement(id: string) {
		return this.apiFetch(
			`/api/asset-procurements/${id}` as "/api/asset-procurements/:id",
			{
				method: "DELETE",
			},
		);
	}
}

export function useAssetProcurementService(
	apiFetch?: $Fetch,
): AssetProcurementService {
	apiFetch ??= useApiFetch();
	return new AssetProcurementService(apiFetch);
}

/**
 * Fetch asset procurements data with caching using useAsyncData
 */
export function useAssetProcurementData() {
	const assetProcurementService = useAssetProcurementService();

	return useAsyncData("asset-procurements", () =>
		assetProcurementService.getAssetProcurements(),
	);
}
