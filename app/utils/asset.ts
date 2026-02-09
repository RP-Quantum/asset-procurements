import type { AssetType } from "#shared/generated/prisma/enums";
import type { SelectMenuItem } from "@nuxt/ui";

export function getAssetFieldLabel(
	field: keyof SerializedAssetWithRelations & string,
): string {
	switch (field) {
		case "department":
			return "สังกัด";
		case "tag":
			return "รหัสทรัพย์สิน";
		case "type":
			return "ประเภท";
		case "brand":
			return "ยี่ห้อ";
		case "model":
			return "รุ่น";
		case "serialNumber":
			return "หมายเลขซีเรียล (S/N)";
		case "owner":
			return "เจ้าของ";
		case "details":
			return "รายละเอียด";
		case "contractNumber":
			return "เลขที่สัญญา";
		case "contractEndDate":
			return "วันสิ้นสุดสัญญา";
		default:
			return field;
	}
}

export function getAssetTypeSelectMenuItems(): (SelectMenuItem & {
	label: string;
	value: AssetType;
})[] {
	return [
		{
			label: "PC",
			value: "PC",
		},
		{
			label: "Monitor",
			value: "Monitor",
		},
		{
			label: "Printer",
			value: "Printer",
		},
		{
			label: "อื่น ๆ",
			value: "Other",
		},
	];
}
