import React, { useCallback, useContext, useState } from "react";
import { createMessage, decryptKey, encryptKey, PrivateKey, readPrivateKey, sign } from "openpgp";
import { useLocalStorage } from "react-use";

type KeysProviderContext = ReturnType<typeof useKeysProviderState>;

const KeysContext = React.createContext({} as KeysProviderContext);

export const useKeys = () => useContext(KeysContext);

const useKeysProviderState = () => {
	const [armoredPrivateKey, setArmoredPrivateKey, clearArmoredPrivateKey] = useLocalStorage<string | undefined>(
		"private-key"
	);
	const [privateKey, setPrivateKey] = useState<PrivateKey>();

	const importPrivateKey = useCallback(
		async (armoredKey: string, passphrase: string) => {
			const key = await readPrivateKey({ armoredKey });

			if (key.isDecrypted()) {
				const encryptedKey = await encryptKey({ privateKey: key, passphrase });
				setArmoredPrivateKey(encryptedKey.armor());
			} else {
				setArmoredPrivateKey(key.armor());
			}
		},
		[setArmoredPrivateKey]
	);

	const unlockKey = useCallback(
		async (passphrase: string) => {
			if (armoredPrivateKey) {
				const key = await readPrivateKey({ armoredKey: armoredPrivateKey });

				if (!key.isDecrypted()) {
					const decryptedKey = await decryptKey({ privateKey: key, passphrase });
					setPrivateKey(decryptedKey);
				} else {
					setPrivateKey(key);
				}
			} else {
				throw new Error("no armored key avalible");
			}
		},
		[armoredPrivateKey, setPrivateKey]
	);

	return {
		setup: !!armoredPrivateKey,
		locked: !privateKey || !privateKey.isDecrypted(),
		privateKey,
		unlockKey,
		importPrivateKey,
		reset: clearArmoredPrivateKey,
	};
};

export const KeysProvider: React.FC = ({ children }) => {
	const context = useKeysProviderState();
	return <KeysContext.Provider value={context}>{children}</KeysContext.Provider>;
};
