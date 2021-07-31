import { WebStream } from "openpgp";

export async function readUint8Stream(stream: ReadableStream<Uint8Array> | WebStream<Uint8Array>) {
	const reader = stream.getReader() as ReadableStreamDefaultReader<Uint8Array>;

	const arrays: Uint8Array[] = [];
	while (true) {
		const { done, value } = await reader.read();
		if (done || !value) break;
		if (value) arrays.push(value);
	}

	return concatUint8Arrays(arrays);
}
async function concatUint8Arrays(arrays: Uint8Array[]) {
	const totalLength = arrays.reduce((length, arr) => length + arr.length, 0);
	const merged = new Uint8Array(totalLength);
	let offset = 0;
	for (const array of arrays) {
		merged.set(array, offset);
		offset += array.length;
	}
	return merged;
}
