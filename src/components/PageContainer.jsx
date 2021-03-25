import React, {Suspense} from 'react';
import { Header } from './Header';

export const PageContainer = ({children}) => (
	<>
		<Header/>
		<Suspense fallback={<h1>Loading View...</h1>}>
			{children}
		</Suspense>
	</>
)
