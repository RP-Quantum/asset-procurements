import type {
	AssetRepairInclude,
	AssetRepairWhereInput,
	StringFilter,
} from "#shared/generated/prisma/models";
import {
	assetInclude,
	buildAssetSearchFilter,
} from "~~/server/modules/asset/util";

export const assetRepairInclude = {
	asset: {
		include: assetInclude,
	},
} satisfies AssetRepairInclude;

export function buildAssetRepairSearchFilter(
	search: string | undefined,
): AssetRepairWhereInput | undefined {
	if (!search) {
		return undefined;
	}

	const filter: StringFilter = {
		contains: search,
		mode: "insensitive",
	};

	const fields: (
		| AssetRepairWhereInput
		| Exclude<keyof AssetRepairWhereInput, "AND" | "OR" | "NOT">
	)[] = [
		{ asset: buildAssetSearchFilter(search) },
		"incidentId",
		"title",
		"cause",
		"description",
	];

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
