export async function readUint8Stream(stream: ReadableStream<Uint8Array>) {
	const reader = stream.getReader();

	const arrays: Uint8Array[] = [];
	let done = false;
	while (!done) {
		const result = await reader.read();
		if (result.done) {
			done = true;
			break;
		}
		if (result.value) arrays.push(result.value);
	}
	const merged = new Uint8Array(arrays.reduce((length, arr) => length + arr.length, 0));
	let offset = 0;
	for (const array of arrays) {
		merged.set(array, offset);
		offset += array.length;
	}

	return merged;
}
