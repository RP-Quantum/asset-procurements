export function getAssetRepairFieldLabel(field: string): string {
	const labels: Record<string, string> = {
		asset: "ทรัพย์สิน",
		assetId: "ทรัพย์สิน",
		incidentId: "เลขที่ใบแจ้งซ่อม (INC)",
		title: "หัวข้อ",
		cause: "สาเหตุ",
		description: "รายละเอียด",
		informedAt: "วันที่แจ้งซ่อม",
		createdAt: "วันที่สร้าง",
		updatedAt: "วันที่อัปเดต",
	};

	return labels[field] || field;
}
