import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

import { useKeys } from "../providers/KeysProvider";

type AppSetupRouteProps = {
	path: RouteProps["path"];
	exact: RouteProps["exact"];
	component: RouteProps["component"];
};

export const AppSetupRoute = ({ component, ...props }: AppSetupRouteProps) => {
	const { setup, locked } = useKeys();

	const isReady = setup && !locked;
	let redirect: React.ReactNode = null;
	if (!setup) {
		redirect = <Redirect to="/setup" />;
	} else if (locked) {
		redirect = <Redirect to="/unlock" />;
	}

	return (
		<Route component={isReady ? component : undefined} {...props}>
			{redirect}
		</Route>
	);
};
