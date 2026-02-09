export function useDepartmentData() {
	const headers = useRequestHeaders();

	return useAsyncData("departments", () =>
		$fetch("/api/departments", {
			headers,
		}),
	);
}
