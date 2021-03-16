import { useQuery } from "react-query";
import { useIpfs } from "../providers/IpfsProvider.js";

export function useIpfsFileHash(path){
	const { ipfs } = useIpfs();

	return useQuery(['useIpfsFileCid', path], async () => {
		const result = await ipfs.files.stat(path, {cash: true});

		return result.cid?.toString() ?? null;
	});
}
