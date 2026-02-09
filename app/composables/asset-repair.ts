import type { $Fetch } from "nitropack";
import type {
	CreateAssetRepairDTO,
	UpdateAssetRepairDTO,
} from "#shared/modules/asset-repair";

export class AssetRepairService {
	constructor(private readonly apiFetch: $Fetch) {}

	async getAssetRepairs() {
		return this.apiFetch("/api/asset-repairs");
	}

	async getAssetRepairById(id: string) {
		return this.apiFetch(`/api/asset-repairs/${id}`);
	}

	async countAssetRepairs() {
		return this.apiFetch<number>("/api/asset-repairs/count");
	}

	async createAssetRepair(data: CreateAssetRepairDTO) {
		return this.apiFetch("/api/asset-repairs", {
			method: "POST",
			body: data,
		});
	}

	async updateAssetRepair(id: string, data: UpdateAssetRepairDTO) {
		return this.apiFetch(
			`/api/asset-repairs/${id}` as "/api/asset-repairs/:id",
			{
				method: "PATCH",
				body: data,
			},
		);
	}

	async deleteAssetRepair(id: string) {
		return this.apiFetch(
			`/api/asset-repairs/${id}` as "/api/asset-repairs/:id",
			{
				method: "DELETE",
			},
		);
	}
}

export function useAssetRepairService(apiFetch?: $Fetch): AssetRepairService {
	apiFetch ??= useApiFetch();
	return new AssetRepairService(apiFetch);
}

/**
 * Fetch asset repairs data with caching using useAsyncData
 */
export function useAssetRepairData() {
	const assetRepairService = useAssetRepairService();

	return useAsyncData("asset-repairs", () =>
		assetRepairService.getAssetRepairs(),
	);
}
