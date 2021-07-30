import React, { useContext } from "react";
import { useLocalStorage } from "react-use";

type Device = {
	ipns: string;
};
type DevicesContext = {
	devices: Device[];
};

const DevicesProviderContext = React.createContext<DevicesContext>({ devices: [] });

export const useDevices = () => useContext(DevicesProviderContext);

export const DevicesProvider: React.FC = ({ children }) => {
	const [devices = [], setDevices, clear] = useLocalStorage<Device[]>("devices", []);

	const addDevice = (device: Device) => setDevices((a) => (a || []).concat(device));
	const removeDevice = (device: Device) => setDevices((a) => (a || []).filter((d) => d.ipns !== device.ipns));

	const context = {
		devices,
		addDevice,
		removeDevice,
		clear,
	};

	return <DevicesProviderContext.Provider value={context}>{children}</DevicesProviderContext.Provider>;
};
