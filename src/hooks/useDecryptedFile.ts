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

			const data = await readUint8Stream(res.body);

			const decrypted = await decrypt({
				message: await readMessage({ binaryMessage: data }),
				decryptionKeys: privateKey,
				verificationKeys: publicKey,
				expectSigned: true,
				format: "binary",
			});

			return new Blob([decrypted.data], { type: mimeType ?? undefined });
		},
		{
			enabled: !!privateKey && !!publicKey && !!gateway && !!ipfsHash,
			staleTime: 10 * 1000,
			cacheTime: 60 * 1000,
			refetchOnWindowFocus: false,
		}
	);
}
