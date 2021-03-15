import React from 'react';
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from 'react-query';

import { IPFS_REPO } from '../const';
import { IpfsProvider } from './IpfsProvider';
import { AppSettingsProvider } from './AppSettingsProvider';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			suspense: true,
		},
		mutations: {
			suspense: true,
		}
	}
});

export const GlobalProviders = ({children}) => (
	<ChakraProvider>
		<QueryClientProvider client={queryClient}>
			<AppSettingsProvider>
				<IpfsProvider repo={IPFS_REPO}>
					{children}
				</IpfsProvider>
			</AppSettingsProvider>
		</QueryClientProvider>
	</ChakraProvider>
);
