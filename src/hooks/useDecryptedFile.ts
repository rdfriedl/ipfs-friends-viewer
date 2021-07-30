import { decrypt, readMessage } from "openpgp";
import { useQuery } from "react-query";
import { useAppSettings } from "../providers/AppSettingsProvider";
import { useKeys } from "../providers/KeysProvider";

async function readUint8Stream(stream: ReadableStream<Uint8Array>){
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

export function useDecryptedFile(ipfsHash?: string, mimeType?: string){
	const { gateway } = useAppSettings();
	const { privateKey, publicKey } = useKeys();

	return useQuery<Blob, Error>(
		["decrypt", ipfsHash],
		async () => {
			const res = await fetch(new URL(`/ipfs/${ipfsHash}`, gateway).href);
			if (!res.body) throw new Error("Failed to fetch image");

			const decrypted = await decrypt({
				message: await readMessage({ binaryMessage: res.body }),
				decryptionKeys: privateKey,
				verificationKeys: publicKey,
				expectSigned: true,
				format: "binary",
			});

			const merged = await readUint8Stream(decrypted.data as ReadableStream<Uint8Array>);
			return new Blob([merged], { type: mimeType });
		},
		{
			enabled: !!privateKey && !!publicKey && !!gateway && !!ipfsHash,
			staleTime: 10 * 1000,
			refetchOnWindowFocus: false,
		}
	);
}
