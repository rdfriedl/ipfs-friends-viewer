import React from "react";
import { createGlobalStyle } from "styled-components";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { HashRouter as Router } from "react-router-dom";

import { IPFS_REPO } from "../const";
import { IpfsProvider } from "./IpfsProvider";
import { KeysProvider } from "./KeysProvider";
import { AppSettingsProvider } from "./AppSettingsProvider";
import { DevicesProvider } from "./DevicesProvider";

const GlobalStyles = createGlobalStyle`
	html {
		overflow-y: auto;
		overflow-x: hidden;
	}

	html, body, #root {
		height: 100%;
		overflow: hidden;
	}
`;

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
		mutations: {
			retry: false,
		},
	},
});

export const GlobalProviders: React.FC = ({ children }) => (
	<Router>
		<GlobalStyles />
		<ChakraProvider>
			<QueryClientProvider client={queryClient}>
				<AppSettingsProvider>
					<KeysProvider>
						<DevicesProvider>
							<IpfsProvider repo={IPFS_REPO}>{children}</IpfsProvider>
						</DevicesProvider>
					</KeysProvider>
				</AppSettingsProvider>
			</QueryClientProvider>
		</ChakraProvider>
	</Router>
);
