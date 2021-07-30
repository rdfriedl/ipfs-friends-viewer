import React from "react";
import { useHistory } from "react-router-dom";
import { UnlockKeyModal } from "../components/UnlockKeyModal";

export const UnlockPage = () => {
	const history = useHistory();

	const onUnlock = () => {
		history.replace("/");
	};
	const onReset = () => {
		history.replace("/setup");
	};

	return <UnlockKeyModal isOpen onUnlock={onUnlock} onReset={onReset} />;
};

export const UnlockView = () => <UnlockPage />;
