import React, { useCallback, useContext } from "react";
import { useEvent, useLocalStorage, useUpdate } from "react-use";

type AppSettingsContextType = ReturnType<typeof useAppSettingsContext>;

const IpfsSettingsContext = React.createContext({} as AppSettingsContextType);

export const useAppSettings = () => useContext(IpfsSettingsContext);

const useAppSettingsContext = () => {
	const [setup, setSetup, clearSetup] = useLocalStorage("setup", false);
	const [gateway, setGateway, clearGateway] = useLocalStorage("ipfs-gateway", "https://ipfs.io");
	const [ipfsMode, setIpfsMode, clearIpfsMode] = useLocalStorage("ipfs-mode", "local");
	const [ipfsApiUrl, setIpfsApiUrl, clearIpfsApiUrl] = useLocalStorage("ipfs-api-url", "http://localhost:5001");

	const update = useUpdate();
	useEvent("storage", update, window);

	const clear = useCallback(() => {
		clearSetup();
		clearIpfsApiUrl();
	}, [clearSetup, clearIpfsApiUrl]);

	return {
		setSetup,
		clearSetup,
		ipfsMode,
		setIpfsMode,
		clearIpfsMode,
		ipfsApiUrl,
		setIpfsApiUrl,
		clearIpfsApiUrl,
		gateway,
		setGateway,
		clearGateway,
		clear,
	};
};

export const AppSettingsProvider: React.FC = ({ children }) => {
	const context = useAppSettingsContext();
	return <IpfsSettingsContext.Provider value={context}>{children}</IpfsSettingsContext.Provider>;
};
