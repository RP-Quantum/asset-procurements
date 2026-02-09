import { FetchError } from "ofetch";

export function showToastSuccess({
	title,
	message,
}: {
	title: string;
	message?: string;
}) {
	const toast = useToast();

	toast.add({
		title,
		description: message,
		color: "success",
	});
}

export function handleToastError(error: unknown) {
	const toast = useToast();

	if (error instanceof FetchError) {
		const title = error.data.statusMessage as string | undefined;
		const message = error.data.message as string | undefined;

		toast.add({
			title: title ?? "เกิดข้อผิดพลาด",
			description: message ?? "มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง",
			color: "error",
		});
	} else {
		console.error(error);
		toast.add({
			title: "เกิดข้อผิดพลาด",
			description: "มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง",
			color: "error",
		});
	}
}
