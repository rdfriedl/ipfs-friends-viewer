import { decrypt, readMessage } from "openpgp";
import { useQuery } from "react-query";
import { useIpfs } from "../providers/IpfsProvider";
import { useKeys } from "../providers/KeysProvider";
import { useAppSettings } from "../providers/AppSettingsProvider";

type DeviceInfo = {
	name: string;
};

export function useDeviceInfo(ipnsHash: string) {
	const { gateway } = useAppSettings();
	const { ipfs } = useIpfs();
	const { privateKey, publicKey, setup, locked } = useKeys();

	return useQuery<DeviceInfo, Error>(
		["device", ipnsHash, "info"],
		async () => {
			const data = await fetch(new URL(`/ipns/${ipnsHash}/info`, gateway).href).then((res) => res.text());
			if (!data) throw new Error("unable to fetch device info");
			const decrypted = await decrypt({
				message: await readMessage({ armoredMessage: data }),
				decryptionKeys: privateKey,
				verificationKeys: publicKey,
				expectSigned: true,
			});
			return JSON.parse(decrypted.data) as DeviceInfo;
		},
		{ enabled: !!ipfs && setup && !locked }
	);
}
