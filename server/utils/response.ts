export function createDataResponse<Data>(data: Data): { data: Data };
export function createDataResponse<Data, Meta extends Record<string, unknown>>(
	data: Data,
	meta: Meta,
): { data: Data; meta: Meta };
export function createDataResponse<Data, Meta extends Record<string, unknown>>(
	data: Data,
	meta?: Meta,
) {
	if (meta) {
		return { data, meta };
	}

	return { data };
}
