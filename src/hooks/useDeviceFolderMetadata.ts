import { decrypt, readMessage } from "openpgp";
import { useQuery } from "react-query";
import { useIpfs } from "../providers/IpfsProvider";
import { useKeys } from "../providers/KeysProvider";
import { useAppSettings } from "../providers/AppSettingsProvider";

type FileBackup = {
	filename: string;
	fileHash: string;
};
type FolderBackup = {
	name: string;
	hash: string;
};
type BackupFolderMetadata = {
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
			const data = await fetch(new URL(`/ipns/${ipnsHash}/${folder}/metadata`, gateway).href).then((res) => res.text());
			if (!data) throw new Error("unable to fetch device info");
			const decrypted = await decrypt({
				message: await readMessage({ armoredMessage: data }),
				decryptionKeys: privateKey,
				verificationKeys: publicKey,
				expectSigned: true,
			});
			return JSON.parse(decrypted.data) as BackupFolderMetadata;
		},
		{ enabled: !!ipfs && setup && !locked }
	);
}
