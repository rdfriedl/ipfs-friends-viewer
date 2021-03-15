import React from 'react';
import { ChakraProvider } from "@chakra-ui/react";

import { IPFS_REPO } from '../const';
import { IpfsProvider } from './IpfsProvider';
import { AppSettingsProvider } from './AppSettingsProvider';

export const GlobalProviders = ({children}) => (
	<ChakraProvider>
		<AppSettingsProvider>
			<IpfsProvider repo={IPFS_REPO}>
				{children}
			</IpfsProvider>
		</AppSettingsProvider>
	</ChakraProvider>
);
