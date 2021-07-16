import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAppSettings } from "../providers/AppSettingsProvider";

type SetupRouteProps = RouteProps & {
	redirect?: string;
};

export const SetupRoute: React.FC<SetupRouteProps> = ({ children, redirect = "/setup", ...props }) => {
	const { email } = useAppSettings();

	const notSetup = !email;

	if (notSetup) {
		return <Redirect to={redirect} />;
	}

	return <Route {...props}>{children}</Route>;
};
