import React, { useCallback, useState } from 'react';

import { Divider, Input, Button, FormControl, FormLabel, FormHelperText, Select, VStack } from '@chakra-ui/react';
import { useIpfs } from '../providers/IpfsProvider';
import { useAppSettings } from '../providers/AppSettingsProvider';
import { PageContainer } from '../components/PageContainer.js';

export const SettingsPage = () => {
	const settings = useAppSettings();

	const {loading: ipfsLoading} = useIpfs();

	const [apiUrl, setApiUrl] = useState(settings.apiUrl);
	const [rootFolder, setRootFolder] = useState(settings.rootFolder);
	const [gateway, setGateway] = useState(settings.gateway);
	const [thumbor, setThumbor] = useState(settings.thumbor);

	const handleSubmit = useCallback((e) => {
		e.preventDefault();

		settings.setApiUrl(apiUrl);
		settings.setGateway(gateway);
		settings.setRootFolder(rootFolder);
		settings.setThumbor(thumbor);
		settings.setSetup(true);
	}, [apiUrl, settings, rootFolder, gateway, thumbor]);

	if(ipfsLoading){
		return (
			<>
				<h1>Setting up IPFS...</h1>
				<Button onClick={settings.clear}>clear settings</Button>
			</>
		)
	}

	return (
		<form onSubmit={handleSubmit}>
			<VStack spacing={2}>
				<FormControl id="gateway">
					<FormLabel>IPFS Gateway</FormLabel>
					<Input
						value={gateway ?? ""}
						onChange={e => setGateway(e.target.value)}
					/>
					<FormHelperText>The URL to the api endpoint of the IPFS node</FormHelperText>
				</FormControl>
				<Divider />
				<FormControl id="api-url">
					<FormLabel>Ipfs Node Url</FormLabel>
					<Input
						value={apiUrl ?? ""}
						onChange={e => setApiUrl(e.target.value)}
					/>
					<FormHelperText>The URL to the api endpoint of the IPFS node</FormHelperText>
				</FormControl>
				<FormControl id="root-folder">
					<FormLabel>Galleries Path</FormLabel>
					<Input
						value={rootFolder ?? ""}
						onChange={e => setRootFolder(e.target.value)}
					/>
					<FormHelperText>The root folder on the node</FormHelperText>
				</FormControl>
				<FormControl id="thumbor-url">
					<FormLabel>Thumbor URL</FormLabel>
					<Input
						value={thumbor ?? ""}
						onChange={e => setThumbor(e.target.value)}
					/>
					<FormHelperText>The URL to a thumbor server for resizing thumbnails</FormHelperText>
				</FormControl>
				<Button type="submit">save</Button>
			</VStack>
		</form>
	)
}

export const SettingsView = () => (
	<PageContainer>
		<SettingsPage/>
	</PageContainer>
)
