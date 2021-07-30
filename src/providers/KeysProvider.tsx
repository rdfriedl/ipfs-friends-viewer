import React, { useCallback, useContext, useEffect, useState } from "react";
import { PublicKey, decryptKey, encryptKey, PrivateKey, readPrivateKey, readKey } from "openpgp";
import { useLocalStorage } from "react-use";

type KeysProviderContext = ReturnType<typeof useKeysProviderState>;

const KeysContext = React.createContext({} as KeysProviderContext);

export const useKeys = () => useContext(KeysContext);

const useKeysProviderState = () => {
	const [armoredPrivateKey, setArmoredPrivateKey, clearArmoredPrivateKey] = useLocalStorage<string | undefined>(
		"private-key"
	);
	const [armoredPublicKey, setArmoredPublicKey, clearArmoredPublicKey] = useLocalStorage<string | undefined>(
		"public-key"
	);
	const [privateKey, setPrivateKey] = useState<PrivateKey>();
	const [publicKey, setPublicKey] = useState<PublicKey>();

	useEffect(() => {
		if (armoredPublicKey) {
			readKey({ armoredKey: armoredPublicKey }).then((key) => setPublicKey(key));
		}
	}, [armoredPublicKey]);

	const importKeyPair = useCallback(
		async ({
			armoredPrivateKey,
			armoredPublicKey,
			passphrase,
		}: {
			armoredPrivateKey: string;
			armoredPublicKey: string;
			passphrase: string;
		}) => {
			const privateKey = await readPrivateKey({ armoredKey: armoredPrivateKey });

			if (privateKey.isDecrypted()) {
				const encryptedKey = await encryptKey({ privateKey: privateKey, passphrase });
				setArmoredPrivateKey(encryptedKey.armor());
			} else {
				setArmoredPrivateKey(privateKey.armor());
			}

			setArmoredPublicKey(armoredPublicKey);
		},
		[setArmoredPrivateKey, setArmoredPublicKey]
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

	const reset = useCallback(() => {
		clearArmoredPrivateKey();
		clearArmoredPublicKey();
	}, [clearArmoredPrivateKey, clearArmoredPublicKey]);

	return {
		setup: !!armoredPrivateKey && !!armoredPublicKey,
		locked: !privateKey || !privateKey.isDecrypted(),
		privateKey,
		publicKey,
		unlockKey,
		importKeyPair,
		reset,
	};
};

export const KeysProvider: React.FC = ({ children }) => {
	const context = useKeysProviderState();
	return <KeysContext.Provider value={context}>{children}</KeysContext.Provider>;
};
