import { useQuery } from "react-query";
import { useIpfs } from "../providers/IpfsProvider";

export function useIpfsId() {
	const { loading: loadingIpfs, ipfs } = useIpfs();

	const { data: id, ...rest } = useQuery(
		["useIpfsId"],
		async () => {
			if (ipfs) {
				return await ipfs.id();
			}
		},
		{ enabled: !loadingIpfs }
	);

	return {
		id,
		...rest,
	};
}
