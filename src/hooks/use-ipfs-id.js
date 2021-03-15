import { useAsync } from "react-use";
import { useIpfs } from "../providers/IpfsProvider";

export function useIpfsId(){
	const {loading: loadingIpfs, ipfs} = useIpfs();

	const {loading, value: id} = useAsync(async () => {
		if(ipfs){
			return await ipfs.id();
		}
	}, [ipfs]);

	return {
		loading: loadingIpfs || loading,
		id
	}
}
