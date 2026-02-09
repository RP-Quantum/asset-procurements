export function getAssetProcurementFieldLabel(field: string): string {
  const labels: Record<string, string> = {
    procurement: "การจัดซื้อ",
    repair: "การซ่อม",
    repairId: "การซ่อม",
    asset: "ทรัพย์สิน",
    assetId: "ทรัพย์สิน",
    data: "ข้อมูลการจัดซื้อ",
    vendor: "ผู้จำหน่าย",
    quoteId: "เลขที่ใบเสนอราคา",
    itemName: "รายการสินค้า/บริการ",
    torOfficer: "เจ้าหน้าที่ TOR",
    torOfficerPosition: "ตำแหน่งเจ้าหน้าที่ TOR",
    torOfficerDepartment: "หน่วยงานเจ้าหน้าที่ TOR",
    estimatedBudget: "งบประมาณโดยประมาณ",
    createdAt: "วันที่สร้าง",
    updatedAt: "วันที่อัปเดต",
    reason: "เหตุผลในการจัดซื้อ",
    source: "แหล่งที่มาราคากลาง",
  };

  return labels[field] || field;
}
