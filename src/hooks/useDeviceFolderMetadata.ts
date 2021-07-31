import { decrypt, readMessage } from "openpgp";
import { useQuery } from "react-query";
import { useIpfs } from "../providers/IpfsProvider";
import { useKeys } from "../providers/KeysProvider";
import { useAppSettings } from "../providers/AppSettingsProvider";

export type FileBackup = {
	filename: string;
	fileHash: string;
	mimeType: string | null;
	ipfsHash: string;
};
export type FolderBackup = {
	name: string;
	hash: string;
};
export type BackupFolderMetadata = {
	files: FileBackup[];
	folders: FolderBackup[];
};

export function useDeviceFolderMetadata(ipnsHash: string, folder: string) {
	const { gateway } = useAppSettings();
	const { ipfs } = useIpfs();
	const { privateKey, publicKey, setup, locked } = useKeys();

	return useQuery<BackupFolderMetadata, Error>(
		["device", ipnsHash, folder, "metadata"],
		async () => {
			const res = await fetch(new URL(`/ipns/${ipnsHash}/${folder}/metadata`, gateway).href);
			if (!res.ok) throw new Error("unable to fetch device info");
			const data = await res.text();

			const decrypted = await decrypt({
				message: await readMessage({ armoredMessage: data }),
				decryptionKeys: privateKey,
				verificationKeys: publicKey,
				expectSigned: true,
			});
			return JSON.parse(decrypted.data) as BackupFolderMetadata;
		},
		{
			enabled: !!ipfs && setup && !locked,
			staleTime: 10 * 1000,
			refetchOnWindowFocus: false,
		}
	);
}
