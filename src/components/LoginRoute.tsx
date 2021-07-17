import React from "react";
import { Link, Redirect, Route } from "react-router-dom";
import { useKeys } from "../providers/KeysProvider";

export const LoginRoute: React.FC = ({ children, ...props }) => {
	const { setup, locked, importPrivateKey, unlockKey } = useKeys();

	if (!setup) {
		return <Redirect to="/setup" />;
	}

	return <Route {...props}>{children}</Route>;
};
