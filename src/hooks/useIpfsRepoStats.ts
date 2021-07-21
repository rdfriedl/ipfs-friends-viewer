import { useQuery } from "react-query";
import { useIpfs } from "../providers/IpfsProvider";

export async function useIpfsRepoStats(interval: number | false = false) {
	const { ipfs } = useIpfs();

	return useQuery("ipfsStats", () => ipfs?.repo.stat(), { enabled: !!ipfs, refetchInterval: interval });
}
