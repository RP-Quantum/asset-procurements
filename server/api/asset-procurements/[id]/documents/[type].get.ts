import { useAssetProcurementService } from "~~/server/modules/asset-procurement";
import { useDocumentService } from "~~/server/modules/document";

export default defineLazyEventHandler(() => {
	const procurementService = useAssetProcurementService(prisma);
	const documentService = useDocumentService();

	return defineAuthenticatedEventHandler(async (event) => {
		try {
			const id = getRouterParam(event, "id");
			const type = getRouterParam(event, "type");

			if (!id) {
				throw createError({
					statusCode: 400,
					message: "Missing procurement ID",
				});
			}

			if (!type) {
				throw createError({
					statusCode: 400,
					message: "Missing document type",
				});
			}

			// Get procurement data with relations
			const procurement = await procurementService.getAssetProcurementById(id);

			// Generate the document based on type
			const { name, data } = await documentService.generateProcurementDocument(
				procurement,
				type,
			);

			// Set headers for file download
			setResponseHeader(
				event,
				"Content-Type",
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			);
			setResponseHeader(
				event,
				"Content-Disposition",
				`attachment; filename="${encodeURIComponent(name)}"`,
			);

			return data;
		} catch (error) {
			return handleEventHandlerError(error);
		}
	});
});
