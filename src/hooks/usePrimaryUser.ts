import { useQuery } from "react-query";
import { useKeys } from "../providers/KeysProvider";

export function usePrimaryUser() {
	const { privateKey, locked } = useKeys();

	return useQuery(["primaryUserId", locked, privateKey?.getKeyID().toHex()], async () => {
		if (locked || !privateKey) {
			return null;
		}

		return (await privateKey.getPrimaryUser()).user;
	});
}
