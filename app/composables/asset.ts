import type { $Fetch } from "nitropack";
import type { CreateAssetDTO, UpdateAssetDTO } from "#shared/modules/asset";

export class AssetService {
	constructor(private readonly apiFetch: $Fetch) {}

	async getAssets(query?: {
	page?: number;
	perPage?: number;
	search?: string;
}) {
	return this.apiFetch("/api/assets", {
		query,
	});
}


	async getAssetById(id: string) {
		return this.apiFetch(`/api/assets/${id}`);
	}

	async countAssets() {
		return this.apiFetch<number>("/api/assets/count");
	}

	async createAsset(data: CreateAssetDTO) {
		return this.apiFetch("/api/assets", {
			method: "POST",
			body: data,
		});
	}

	async updateAsset(id: string, data: UpdateAssetDTO) {
		return this.apiFetch(`/api/assets/${id}` as "/api/assets/:id", {
			method: "PATCH",
			body: data,
		});
	}

	async deleteAsset(id: string) {
		return this.apiFetch(`/api/assets/${id}` as "/api/assets/:id", {
			method: "DELETE",
		});
	}
}

export function useAssetService(apiFetch?: $Fetch): AssetService {
	apiFetch ??= useApiFetch();
	return new AssetService(apiFetch);
}

/**
 * Fetch assets data with caching using useAsyncData
 */
export function useAssetData(params?: {
	page?: number;
	perPage?: number;
	search?: string;
	noPagination?: boolean;
}) {
	const assetService = useAssetService();

	return useAsyncData(
		`assets-${params?.noPagination ? "all" : "page"}`,
		() =>
			assetService.getAssets({
				page: params?.noPagination ? undefined : params?.page ?? 1,
				perPage: params?.noPagination ? undefined : params?.perPage ?? 20,
				search: params?.search,
				noPagination: params?.noPagination,
			}),
	);
}




/**
 * Fetch single asset data with caching using useAsyncData
 */
export function useAssetDetailData(id: MaybeRefOrGetter<string>) {
	const assetService = useAssetService();

	return useAsyncData(`asset-${toValue(id)}`, () =>
		assetService.getAssetById(toValue(id)),
	);
}

/**
 * Fetch asset count with caching using useAsyncData
 */
export function useAssetCountData() {
	const assetService = useAssetService();

	return useAsyncData("assets-count", () => assetService.countAssets());
}
