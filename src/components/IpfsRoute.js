import React from 'react';
import {Link, Route} from 'react-router-dom';
import { useIpfs } from '../providers/IpfsProvider';

export const IpfsRoute = ({children, direct = '/settings', ...props}) => {
	const {loading, ipfs} = useIpfs();

	if(!ipfs){
		if(loading){
			return (
				<h1>Setting up IPFS...</h1>
			)
		}
		else {
			return (
				<>
					<h1>looks like IPFS is not working</h1>
					<Link to={direct}>Go to settings</Link>
				</>
			)
		}
	}

	return (
		<Route {...props}>{children}</Route>
	)
}
