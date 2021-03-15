import React, { useContext, useEffect, useMemo } from 'react';
// import IPFS from 'ipfs';
import ipfsHttpClient from 'ipfs-http-client';
import {useAsync} from 'react-use';
import { useAppSettings } from './AppSettingsProvider';

export const IpfsContext = React.createContext();

export const useIpfs = () => useContext(IpfsContext);

export const IpfsProvider = ({ children, repo }) => {
	const { ipfsMode, setup, apiUrl } = useAppSettings();
	// const [loading, setLoading] = useState(true);

	// useEffect(() => {

	// }, [ipfsMode, setup, apiUrl]);

	const state = useAsync( async () => {
		if (!setup){
			return null;
		}

		if( apiUrl ) {
			console.info('connecting to remote node');
			const client = await ipfsHttpClient({url: apiUrl});

			const {id} = await client.id();
			console.log(`connected to ${id}`);

			return client;
		}
		// else if(ipfsMode === 'local'){
		// 	console.info('starting local node');

		// 	const client = await IPFS.create({
		// 		start: true,
		// 		repo,
		// 		preload: {
		// 			enabled: true
		// 		},
		// 		EXPERIMENTAL: {
		// 			pubsub: true,
		// 		},
		// 		// config: {
		// 		// 	Addresses: {
		// 		// 		Swarm: [
		// 		// 			// Use IPFS dev signal server
		// 		// 			// '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
		// 		// 			// '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
		// 		// 			// Use IPFS dev webrtc signal server
		// 		// 			// '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
		// 		// 			// '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
		// 		// 			// '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/',
		// 		// 			// Use local signal server
		// 		// 			// '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
		// 		// 		]
		// 		// 	},
		// 		// }
		// 	});

		// 	const { id } = await client.id();
		// 	console.log(`ipfs node id ${id}`);

		// 	return client;
		// }
		else {
			return null;
		}
	}, [repo, apiUrl, ipfsMode, setup]);

	const context = useMemo(() => ({
		error: state.error,
		loading: state.loading,
		ipfs: state.value
	}), [state]);

	useEffect(() => {
		if(!context.loading && window.ipfs !== context.ipfs){
			window.ipfs = context.ipfs;
		}
	}, [context]);

	return (
		<IpfsContext.Provider value={context}>
			{children}
		</IpfsContext.Provider>
	)
}
