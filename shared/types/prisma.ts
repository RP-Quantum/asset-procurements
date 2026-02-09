import type { SerializeObject } from "nitropack";
import type {
	Asset,
	AssetProcurement,
	AssetRepair,
	Department,
	Location,
	User,
} from "#shared/generated/prisma/client";
import type { ProcurementDataDTO } from "#shared/modules/asset-procurement";

export type AssetProcurementData = ProcurementDataDTO;
export type AssetProcurementWithData = AssetProcurement & {
	data: AssetProcurementData | null;
};

export type AssetWithRelations = Asset & {
	department: DepartmentWithRelations;
};
export type AssetRepairWithRelations = AssetRepair & {
	asset: AssetWithRelations;
};
export type AssetProcurementWithRelations = AssetProcurementWithData & {
	repair: AssetRepairWithRelations;
};
export type DepartmentWithRelations = Department & {
	location: Location;
};

export type SerializedAsset = SerializeObject<Asset>;
export type SerializedAssetRepair = SerializeObject<AssetRepair>;
export type SerializedAssetProcurement =
	SerializeObject<AssetProcurementWithRelations>;
export type SerializedDepartment = SerializeObject<Department>;
export type SerializedLocation = SerializeObject<Location>;
export type SerializedUser = SerializeObject<User>;

export type SerializedAssetWithRelations = SerializeObject<AssetWithRelations>;
export type SerializedAssetRepairWithRelations =
	SerializeObject<AssetRepairWithRelations>;
export type SerializedAssetProcurementWithRelations =
	SerializeObject<AssetProcurementWithRelations>;
export type SerializedDepartmentWithRelations =
	SerializeObject<DepartmentWithRelations>;
