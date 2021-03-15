import { useQuery } from "react-query";
import { useAsync } from "react-use";
import { useIpfs } from "../providers/IpfsProvider.js";

export function useIpfsFolder(path, opts){
	const { ipfs } = useIpfs();

	return useQuery(['useIpfsFolder', path], async () => {
		const list = ipfs.files.ls(path);

		const entries = [];
		for await (let entry of list){
			entries.push(entry);
		}
		return entries;
	}, {
		enabled: !!path ?? opts.enabled,
		...opts
	});
}
