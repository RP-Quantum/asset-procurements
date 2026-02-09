import type {
	AssetInclude,
	AssetWhereInput,
	StringFilter,
} from "#shared/generated/prisma/models";
import { departmentInclude } from "~~/server/modules/department";

export const assetInclude = {
	department: {
		include: departmentInclude,
	},
} satisfies AssetInclude;

export function buildAssetSearchFilter(
	search: string | undefined,
): AssetWhereInput | undefined {
	if (!search) {
		return undefined;
	}

	const filter: StringFilter = {
		contains: search,
		mode: "insensitive",
	};

	const fields: (
		| AssetWhereInput
		| Exclude<keyof AssetWhereInput, "AND" | "OR" | "NOT">
	)[] = [
		{ department: { name: filter } },
		"tag",
		"brand",
		"model",
		"serialNumber",
		"owner",
		"details",
		"contractNumber",
		"contractEndDate",
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
