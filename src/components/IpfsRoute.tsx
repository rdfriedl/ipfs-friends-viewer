import React from "react";
import { Link, Route, RouteProps } from "react-router-dom";
import { useIpfs } from "../providers/IpfsProvider";

type IpfsRouteProps = RouteProps & {
	redirect?: string;
};

export const IpfsRoute: React.FC<IpfsRouteProps> = ({ children, redirect = "/setup", ...props }) => {
	const { loading, ipfs } = useIpfs();

	if (!ipfs) {
		if (loading) {
			return <h1>Setting up IPFS...</h1>;
		} else {
			return (
				<>
					<h1>looks like IPFS is not working</h1>
					<Link to={redirect}>Go to setup</Link>
				</>
			);
		}
	}

	return <Route {...props}>{children}</Route>;
};
