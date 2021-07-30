import { decrypt, readMessage } from "openpgp";
import { useQuery } from "react-query";
import { useAppSettings } from "../providers/AppSettingsProvider";
import { useKeys } from "../providers/KeysProvider";
import { readUint8Stream } from "../helpers/typed-array";

export function useDecryptedFile(ipfsHash?: string, mimeType?: string | null) {
	const { gateway } = useAppSettings();
	const { privateKey, publicKey } = useKeys();

	return useQuery<Blob, Error>(
		["useDecryptedFile", ipfsHash, mimeType],
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
			return new Blob([merged], { type: mimeType ?? undefined });
		},
		{
			enabled: !!privateKey && !!publicKey && !!gateway && !!ipfsHash,
			staleTime: 10 * 1000,
			refetchOnWindowFocus: false,
		}
	);
}
