import type {
	AssetProcurementInclude,
	AssetProcurementWhereInput,
	StringFilter,
} from "#shared/generated/prisma/models";
import {
	assetRepairInclude,
	buildAssetRepairSearchFilter,
} from "~~/server/modules/asset-repair";

export const assetProcurementInclude = {
	repair: {
		include: assetRepairInclude,
	},
} satisfies AssetProcurementInclude;

export function buildAssetProcurementSearchFilter(
	search: string | undefined,
): AssetProcurementWhereInput | undefined {
	if (!search) {
		return undefined;
	}

	const filter: StringFilter = {
		contains: search,
		mode: "insensitive",
	};

	const fields: (
		| AssetProcurementWhereInput
		| Exclude<keyof AssetProcurementWhereInput, "AND" | "OR" | "NOT">
	)[] = [{ repair: buildAssetRepairSearchFilter(search) }];

	return {
		OR: [
			...fields.map((field) => {
				if (typeof field === "string") {
					return { [field]: filter };
				}

				return field;
			}),
		],
	};
}
