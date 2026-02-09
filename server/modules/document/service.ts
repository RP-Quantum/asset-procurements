import { PROCUREMENT_DOCUMENTS } from "#shared/consts/procurement-documents";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { readFile } from "fs/promises";
import { join } from "path";
import ThaiBahtText from "thai-baht-text";

export class DocumentService {
	private templatePath: string;

	constructor() {
		// Template files should be placed in server/docs/templates
		this.templatePath = join(process.cwd(), "server", "docs", "templates");
	}

	/**
	 * Generate a DOCX document from an asset procurement using a template
	 */
	async generateProcurementDocument(
		procurement: AssetProcurementWithRelations,
		documentType: string,
	): Promise<{ name: string; data: Buffer }> {
		try {
			// Map document type to template filename
			const templateName = `${documentType}.docx`;

			// Read the template file
			const templatePath = join(this.templatePath, templateName);
			const content = await readFile(templatePath);

			// Load the template into PizZip
			const zip = new PizZip(content);

			// Create Docxtemplater instance
			const doc = new Docxtemplater(zip, {
				paragraphLoop: true,
				linebreaks: true,
				nullGetter(part) {
					if (!part.module) {
						return "";
					}
					if (part.module === "rawxml") {
						return "";
					}
					return "";
				},
			});

			// Prepare data for the template
			const data = this.prepareProcurementData(procurement);

			// Set the template data
			doc.render(data);

			// Generate the document buffer
			const buffer = doc.getZip().generate({
				type: "nodebuffer",
				compression: "DEFLATE",
			});

			return {
				name: `${procurement.repair.asset.tag || "unknown-asset"}-${
					PROCUREMENT_DOCUMENTS.find((doc) => doc.value === documentType)
						?.label || "document"
				}.docx`,
				data: buffer,
			};
		} catch (error) {
			console.error("Error generating document:", error);
			throw createError({
				statusCode: 500,
				message: "Failed to generate document",
			});
		}
	}

	/**
	 * Prepare asset procurement data for the template
	 */
	private prepareProcurementData(
		procurement: AssetProcurementWithRelations,
	): Record<string, unknown> {
		const { repair, data: procurementData } = procurement;
		const asset = repair.asset;

		const assetProcurementItemsLength =
			procurementData?.procureItems?.length ?? 0;
		const assetProcurementItems = procurementData?.procureItems?.map(
			(item, index) => {
				// User enters total (including VAT) and quantity
				// Calculate: subtotal = total / 1.07, vat = subtotal * 0.07, price = subtotal / quantity
				const subtotal = item.total / 1.07;
				const vat = subtotal * 0.07;
				const pricePerUnit = subtotal / item.quantity || 0;

				return {
					name: item.itemName ?? "",
					no: index + 1,
					price: pricePerUnit.toLocaleString("th-TH", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					}),
					quantity: item.quantity,
					subtotal: subtotal.toLocaleString("th-TH", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					}),
					vat: vat.toLocaleString("th-TH", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					}),
					total: item.total.toLocaleString("th-TH", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					}),
					priceXQuantity: subtotal.toLocaleString("th-TH", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					}),
				};
			},
		);
		const assetProcurementTotal = (() => {
			const total = assetProcurementItems?.reduce((sum, item) => {
				const itemTotal = Number(item.total.toString().replace(/,/g, ""));
				return sum + (isNaN(itemTotal) ? 0 : itemTotal);
			}, 0);

			return total ?? 0;
		})();
		const assetProcrementTotalThaiBaht = new Intl.NumberFormat("th-TH", {
			style: "currency",
			currency: "THB",
		}).format(assetProcurementTotal);

		const assetProcurementTotalSubtotal =
			assetProcurementItems?.reduce((sum, item) => {
				const itemSubtotal = Number(item.subtotal.toString().replace(/,/g, ""));
				return sum + (isNaN(itemSubtotal) ? 0 : itemSubtotal);
			}, 0) ?? 0;

		const assetProcurementTotalVat =
			assetProcurementTotal - assetProcurementTotalSubtotal;

		// Fill empty rows to ensure at least 10 rows in the document
		for (let i = assetProcurementItemsLength; i < 10; i++) {
			assetProcurementItems?.push({
				no: i + 1,
				name: "",
				price: "",
				quantity: "" as unknown as number,
				subtotal: "",
				vat: "",
				total: "",
				priceXQuantity: "",
			});
		}

		function parseValidData(value: unknown): string {
			if (typeof value === "string") {
				return value ? value : "";
			} else if (typeof value === "number") {
				return value.toString();
			} else if (value instanceof Date) {
				return isNaN(value.getTime())
					? ""
					: value.toLocaleDateString("th-TH", {
							year: "numeric",
							month: "long",
							day: "numeric",
						});
			} else if (typeof value === "undefined" || value === null) {
				return "";
			} else {
				console.warn("Unsupported data type in template data:", value);
				return "";
			}
		}

		return {
			...Object.fromEntries(
				Object.entries(asset).map(([key, value]) => [
					`asset.${key}`,
					parseValidData(value),
				]),
			),
			"asset.type": (() => {
				switch (asset.type) {
					case "PC":
						return "คอมพิวเตอร์";
					case "Monitor":
						return "จอภาพ";
					case "Printer":
						return "เครื่องพิมพ์";
					case "Other":
					default:
						return "อุปกรณ์";
				}
			})(),
			// Override data for asset
			...Object.fromEntries(
				Object.entries(repair).map(([key, value]) => [
					`assetRepair.${key}`,
					parseValidData(value),
				]),
			),
			// Override data for asset repair
			"assetRepair.informedAt": new Date(repair.informedAt).toLocaleDateString(
				"th-TH",
				{
					year: "numeric",
					month: "long",
					day: "numeric",
				},
			),
			...Object.fromEntries(
				Object.entries(procurement).map(([key, value]) => [
					`assetProcurement.${key}`,
					parseValidData(value),
				]),
			),
			// Override data for asset procurement
			...Object.fromEntries(
				Object.entries(procurementData || {}).map(([key, value]) => [
					`assetProcurement.${key}`,
					parseValidData(value),
				]),
			),
			// Override data from procurement data
			...Object.fromEntries(
				Object.entries(asset.department || {}).map(([key, value]) => [
					`department.${key}`,
					parseValidData(value),
				]),
			),
			"assetProcurement.estimatedBudget": Number(
				procurementData?.estimatedBudget,
			).toLocaleString("th-TH"),
			"assetProcurement.procureItems.length": assetProcurementItemsLength,
			"assetProcurement.procureItems": assetProcurementItems,
			"assetProcurement.total": assetProcurementTotal.toLocaleString("th-TH", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			}),
			"assetProcurement.totalThaiBaht": assetProcrementTotalThaiBaht,
			"assetProcurement.totalThaiBahtText": ThaiBahtText(assetProcurementTotal),
			...Object.fromEntries(
				Object.entries(asset.department?.location || {}).map(([key, value]) => [
					`faculty.${key}`,
					parseValidData(value),
				]),
			),
			"assetProcurement.totalSubtotal":
				assetProcurementTotalSubtotal.toLocaleString("th-TH", {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				}),
			"assetProcurement.totalVat": assetProcurementTotalVat.toLocaleString(
				"th-TH",
				{
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				},
			),
			"assetProcurement.reportDate": procurementData?.reportDate
				? new Date(procurementData.reportDate).toLocaleDateString("th-TH", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})
				: "",
			"assetProcurement.taxInvoiceDate": procurementData?.taxInvoiceDate
				? new Date(procurementData.taxInvoiceDate).toLocaleDateString("th-TH", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})
				: "",
			"assetProcurement.deliveryDate": procurementData?.deliveryDate
				? new Date(procurementData.deliveryDate).toLocaleDateString("th-TH", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})
				: "",
			"assetProcurement.hasVat": procurementData?.hasVat ? "☑" : "☐",
			"assetProcurement.noVat": !procurementData?.hasVat ? "☑" : "☐",
			"assetProcurement.isAllCorrect":
				procurementData?.deliveranceStatus === "ถูกต้องครบถ้วน" ? "☑" : "☐",
			"assetProcurement.isCorrectButIncomplete":
				procurementData?.deliveranceStatus === "ถูกต้องแต่ไม่ครบถ้วน"
					? "☑"
					: "☐",
			"assetProcurement.isCompleteButNotAllCorrect":
				procurementData?.deliveranceStatus === "ครบถ้วนแต่ไม่ถูกต้องทั้งหมด"
					? "☑"
					: "☐",
		};
	}
}

export function useDocumentService(): DocumentService {
	return new DocumentService();
}
