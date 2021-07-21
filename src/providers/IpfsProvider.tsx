import React, { useContext, useEffect, useMemo } from "react";
import { useAsync } from "react-use";

import { IPFS } from "ipfs-core-types";
import { create as createIpfsNode } from "ipfs-core";
import { create as createIpfsHttpClient } from "ipfs-http-client";
import { useAppSettings } from "./AppSettingsProvider";

type IpfsContext = {
	error?: Error;
	loading: boolean;
	ipfs?: IPFS | null;
};

export const IpfsContext = React.createContext<IpfsContext>({ loading: true });

export const useIpfs = () => useContext(IpfsContext);

type IpfsProviderProps = {
	repo: string;
};

export const IpfsProvider: React.FC<IpfsProviderProps> = ({ children, repo }) => {
	const { ipfsMode, ipfsApiUrl } = useAppSettings();

	const state = useAsync(async () => {
		if (ipfsMode === "remote" && ipfsApiUrl) {
			console.info("connecting to remote node");
			const client = await createIpfsHttpClient({ url: ipfsApiUrl });
			const { id } = await client.id();
			console.log(`connected to ${id}`);
			return client;
		} else if (ipfsMode === "local") {
			console.info("starting local node");
			const client = await createIpfsNode({
				start: true,
				repo,
				preload: {
					enabled: true,
				},
			});
			const { id } = await client.id();
			console.log(`ipfs node id ${id}`);
			return client;
		} else {
			return null;
		}
	}, [repo, ipfsApiUrl, ipfsMode]);

	const context = useMemo<IpfsContext>(
		() => ({
			error: state.error,
			loading: state.loading,
			ipfs: state.value,
		}),
		[state]
	);

	useEffect(() => {
		// @ts-ignore
		window.ipfs = state.value;
	}, [state.value]);

	return <IpfsContext.Provider value={context}>{children}</IpfsContext.Provider>;
};
