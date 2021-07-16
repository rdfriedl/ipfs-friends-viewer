import React, { useCallback, useState } from "react";

import { Divider, Input, Button, FormControl, FormLabel, FormHelperText, Select, VStack } from "@chakra-ui/react";
import { useIpfs } from "../providers/IpfsProvider";
import { useAppSettings } from "../providers/AppSettingsProvider";
import { PageContainer } from "../components/PageContainer";

const SettingsPage = () => {
	const settings = useAppSettings();

	const { loading: ipfsLoading } = useIpfs();

	const [ipfsMode, setIpfsMode] = useState(settings.ipfsMode);
	const [email, setEmail] = useState(settings.email);
	const [apiUrl, setApiUrl] = useState(settings.apiUrl);
	const [gateway, setGateway] = useState(settings.gateway);
	const [thumbor, setThumbor] = useState(settings.thumbor);

	const handleSubmit = useCallback(
		(e) => {
			e.preventDefault();

			settings.setApiUrl(apiUrl);
			settings.setEmail(email);
			settings.setIpfsMode(ipfsMode);
			settings.setGateway(gateway);
			settings.setThumbor(thumbor);
			settings.setSetup(true);
		},
		[apiUrl, settings, gateway, thumbor, ipfsMode, email]
	);

	if (ipfsLoading) {
		return (
			<>
				<h1>Setting up IPFS...</h1>
				<Button onClick={settings.clear}>clear settings</Button>
			</>
		);
	}

	return (
		<form onSubmit={handleSubmit}>
			<VStack spacing={2}>
				<FormControl id="email">
					<FormLabel>Email</FormLabel>
					<Input type="email" value={email ?? ""} onChange={(e) => setEmail(e.target.value)} />
				</FormControl>
				<Divider />
				<FormControl id="gateway">
					<FormLabel>IPFS Gateway</FormLabel>
					<Input type="url" value={gateway ?? ""} onChange={(e) => setGateway(e.target.value)} />
					<FormHelperText>The URL to the api endpoint of the IPFS node</FormHelperText>
				</FormControl>
				<Divider />
				<FormControl id="ipfs-mode">
					<FormLabel>IPFS Mode</FormLabel>
					<Select value={ipfsMode ?? ""} onChange={(e) => setIpfsMode(e.target.value)}>
						<option value="remote">remote</option>
						<option value="local">local</option>
					</Select>
				</FormControl>
				<FormControl id="api-url">
					<FormLabel>Ipfs Friends Api Url</FormLabel>
					<Input value={apiUrl ?? ""} onChange={(e) => setApiUrl(e.target.value)} />
				</FormControl>
				<FormControl id="thumbor-url">
					<FormLabel>Thumbor URL</FormLabel>
					<Input value={thumbor ?? ""} onChange={(e) => setThumbor(e.target.value)} />
					<FormHelperText>The URL to a thumbor server for resizing thumbnails</FormHelperText>
				</FormControl>
				<Button type="submit">save</Button>
			</VStack>
		</form>
	);
};

const SettingsView = () => (
	<PageContainer>
		<SettingsPage />
	</PageContainer>
);

export default SettingsView;
