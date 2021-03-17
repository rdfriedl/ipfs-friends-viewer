import { useQuery } from "react-query";
import isIpfs from 'is-ipfs';
import { useIpfs } from "../providers/IpfsProvider.js";

export function useIpfsFolder(address, opts){
	const { ipfs } = useIpfs();

	if(!isIpfs.path(address) && !isIpfs.cid(address)){
		throw new Error(`${address} is not an ipfs path ro cid`);
	}

	return useQuery(['useIpfsFolder', address], async () => {
		const list = ipfs.ls(address);

		const entries = [];
		for await (let entry of list){
			entries.push(entry);
		}
		return entries;
	}, {
		enabled: !!address ?? opts.enabled,
		...opts
	});
}

export function useIpfsFileFolder(path, opts){
	const { ipfs } = useIpfs();

	return useQuery(['useIpfsFileFolder', path], async () => {
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
