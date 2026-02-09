export const PROCUREMENT_DOCUMENTS = [
	{
		label: "ขออนุมัติหลักการจัดซื้ออะไหล่",
		value: "request-approval-for-procurement-of-parts",
		icon: "lucide:file-text",
	},
	{
		label:
			"ขออนุมัติแต่งตั้งเจ้าหน้าที่กำหนดร่างขอบเขตของงาน (Terms  Of  Reference: TOR)",
		value: "request-approval-for-appointing-tor-officer",
		icon: "lucide:file-text",
	},
	{
		label: "ขอจัดซื้อ ฮาร์ดแวร์ และ อุปกรณ์ต่อพ่วง",
		value: "request-for-procurement-of-hardware-and-peripherals",
		icon: "lucide:file-text",
	},
	{
		label: "รายงานขอซื้อ",
		value: "request-for-purchase-report",
		icon: "lucide:file-text",
	},
	{
		label: "ขออนุมัติจัดซื้อ",
		value: "request-for-procurement-approval",
		icon: "lucide:file-text",
	},
	{
		label: "รายงานผลการตรวจรับและขออนุมัติจ่ายเงิน",
		value: "inspection-report-and-payment-approval",
		icon: "lucide:file-text",
	},
	{
		label: "ใบสำคัญจ่ายเงิน",
		value: "payment-voucher",
		icon: "lucide:file-text",
	},
] as const;

export type ProcurementDocumentType =
	(typeof PROCUREMENT_DOCUMENTS)[number]["value"];
