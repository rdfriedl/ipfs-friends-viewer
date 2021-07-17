import React, { useCallback, useContext } from "react";
import { useEvent, useLocalStorage, useUpdate } from "react-use";

type AppSettingsContextType = ReturnType<typeof useAppSettingsContext>;

const IpfsSettingsContext = React.createContext({} as AppSettingsContextType);

export const useAppSettings = () => useContext(IpfsSettingsContext);

const useAppSettingsContext = () => {
	const [setup, setSetup, clearSetup] = useLocalStorage("setup", false);
	const [ipfsMode, setIpfsMode, clearIpfsMode] = useLocalStorage("ipfs-mode", "local");
	const [email, setEmail, clearEmail] = useLocalStorage("email", "");
	const [privateKey, setPrivateKey, clearPrivateKey] = useLocalStorage("private-key", "");
	const [ipfsApiUrl, setIpfsApiUrl, clearIpfsApiUrl] = useLocalStorage("ipfs-api-url", "http://localhost:5001");
	const [gateway, setGateway, clearGateway] = useLocalStorage("ipfs-gateway", "https://ipfs.io");
	const [thumbor, setThumbor, clearThumbor] = useLocalStorage("thumbor-url", "");
	const [rootFolder, setRootFolder, clearRootFolder] = useLocalStorage("galleries", "/galleries");

	const update = useUpdate();
	useEvent("storage", update, window);

	const clear = useCallback(() => {
		clearSetup();
		clearIpfsApiUrl();
		clearRootFolder();
		clearThumbor();
	}, [clearSetup, clearIpfsApiUrl, clearRootFolder, clearThumbor]);

	return {
		setup: !!setup,
		setSetup,
		clearSetup,
		ipfsMode,
		setIpfsMode,
		clearIpfsMode,
		email,
		setEmail,
		clearEmail,
		privateKey,
		setPrivateKey,
		clearPrivateKey,
		ipfsApiUrl,
		setIpfsApiUrl,
		clearIpfsApiUrl,
		gateway,
		setGateway,
		clearGateway,
		thumbor,
		setThumbor,
		clearThumbor,
		rootFolder,
		setRootFolder,
		clearRootFolder,
		clear,
	};
};

export const AppSettingsProvider: React.FC = ({ children }) => {
	const context = useAppSettingsContext();
	return <IpfsSettingsContext.Provider value={context}>{children}</IpfsSettingsContext.Provider>;
};
