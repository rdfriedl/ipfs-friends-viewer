import React, { useCallback, useContext } from 'react';
import { useEvent, useLocalStorage, useUpdate } from 'react-use';

const IpfsSettingsContext = React.createContext({});

export const useAppSettings = () => useContext(IpfsSettingsContext);

export const AppSettingsProvider = ({children}) => {
	const [setup, setSetup, clearSetup] = useLocalStorage('setup');
	const [ipfsMode, setIpfsMode, clearIpfsMode] = useLocalStorage('ipfs-mode', 'local');
	const [apiUrl, setApiUrl, clearApiUrl] = useLocalStorage('ipfs-api-url');
	const [gateway, setGateway, clearGateway] = useLocalStorage('ipfs-gateway', 'https://ipfs.io');
	const [thumbor, setThumbor, clearThumbor] = useLocalStorage('thumbor-url');
	const [rootFolder, setRootFolder, clearRootFolder] = useLocalStorage('galleries', '/galleries');

	const update = useUpdate();
	useEvent('storage', update, window);

	const clear = useCallback(() => {
		clearSetup();
		clearApiUrl();
		clearRootFolder();
		clearThumbor();
	}, [clearSetup, clearApiUrl, clearRootFolder, clearThumbor]);

	const context = {
		setup, setSetup, clearSetup,
		ipfsMode, setIpfsMode, clearIpfsMode,
		apiUrl, setApiUrl, clearApiUrl,
		gateway, setGateway, clearGateway,
		thumbor, setThumbor, clearThumbor,
		rootFolder, setRootFolder, clearRootFolder,
		clear,
	};

	return (
		<IpfsSettingsContext.Provider value={context}>{children}</IpfsSettingsContext.Provider>
	)
}
