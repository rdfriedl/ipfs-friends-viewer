import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

import { useKeys } from "../providers/KeysProvider";
import { UnlockKeyModal } from "./UnlockKeyModal";

type AppSetupRouteProps = {
	path: RouteProps["path"];
	exact?: RouteProps["exact"];
	component: RouteProps["component"];
};

export const AppSetupRoute = ({ component, ...props }: AppSetupRouteProps) => {
	const { setup, locked } = useKeys();

	const isReady = setup && !locked;
	let replaceContents: React.ReactNode = null;
	if (!setup) {
		replaceContents = <Redirect to="/setup" />;
	} else if (locked) {
		replaceContents = <UnlockKeyModal isOpen />;
	}

	return (
		<Route component={isReady ? component : undefined} {...props}>
			{replaceContents}
		</Route>
	);
};
