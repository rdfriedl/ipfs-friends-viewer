import React from 'react';
import { useLocation } from 'react-router-dom';
import { LinkButton } from './link-button.js';

export const UpButton = ({children, ...props}) => {
	const {pathname} = useLocation();

	return (
		<LinkButton {...props} to={pathname.replace(/\/+[^\/]+\/*$/, '')}>{children}</LinkButton>
	)
}
