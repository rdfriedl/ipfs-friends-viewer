import React from 'react';
import { Header } from './Header';

export const PageContainer = ({children}) => (
	<>
		<Header/>
		<div>
			{children}
		</div>
	</>
)
