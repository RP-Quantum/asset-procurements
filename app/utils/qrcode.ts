import QRCode from "qrcode";

/**
 * Generate QR code as a data URL
 */
export async function generateAssetQRCode(
	asset: SerializedAssetWithRelations,
): Promise<string> {
	// Generate URL to the asset page on the current website
	const baseUrl = window.location.origin;
	const assetUrl = `${baseUrl}/assets/${asset.id}`;

	return await QRCode.toDataURL(assetUrl, {
		width: 300,
		margin: 2,
		color: {
			dark: "#000000",
			light: "#FFFFFF",
		},
	});
}

/**
 * Download QR code as PNG
 */
export function downloadAssetQRCode(
	dataUrl: string,
	filename: string = "asset-qr-code.png",
): void {
	const link = document.createElement("a");
	link.href = dataUrl;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
