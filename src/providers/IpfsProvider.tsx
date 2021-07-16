import React, { useContext, useMemo } from "react";
// import Ipfs from "ipfs";
// import { create as createIpfsHttpClient } from "ipfs-http-client";
import { useAsync } from "react-use";
import { useAppSettings } from "./AppSettingsProvider";

export const IpfsContext = React.createContext({});

export const useIpfs = () => useContext(IpfsContext);

type IpfsProviderProps = {
	repo: string;
};

export const IpfsProvider: React.FC<IpfsProviderProps> = ({ children, repo }) => {
	const { ipfsMode, apiUrl } = useAppSettings();

	const state = useAsync(async () => {
		if (ipfsMode === "remote" && apiUrl) {
			// @ts-ignore
			await import("https://unpkg.com/ipfs-http-client@50/dist/index.min.js");

			console.info("connecting to remote node");
			// @ts-ignore
			const client = await createIpfsHttpClient({ url: apiUrl });

			const { id } = await client.id();
			console.log(`connected to ${id}`);

			return client;
		} else if (ipfsMode === "local") {
			// @ts-ignore
			await import("https://unpkg.com/ipfs@0.55/dist/index.min.js");
			console.info("starting local node");

			// @ts-ignore
			const client = await Ipfs.create({
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
	}, [repo, apiUrl, ipfsMode]);

	const context = useMemo(
		() => ({
			error: state.error,
			loading: state.loading,
			ipfs: state.value,
		}),
		[state]
	);

	return <IpfsContext.Provider value={context}>{children}</IpfsContext.Provider>;
};
