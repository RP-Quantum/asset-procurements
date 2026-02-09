import type { $Fetch } from "nitropack";

export function useApiFetch(): $Fetch {
	const headers = useRequestHeaders();

	return $fetch.create({
		headers,
	});
}
