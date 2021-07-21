import React, { useCallback, useState } from "react";

import { Formik, Form } from "formik";
import {
	Divider,
	Input,
	Button,
	FormControl,
	FormLabel,
	FormHelperText,
	Select,
	VStack,
	Container,
} from "@chakra-ui/react";
import { useIpfs } from "../providers/IpfsProvider";
import { useAppSettings } from "../providers/AppSettingsProvider";
import { PageContainer } from "../components/PageContainer";

const SettingsPage = () => {
	const settings = useAppSettings();
	const { loading: ipfsLoading } = useIpfs();

	const initialValues = {
		ipfsMode: settings.ipfsMode,
		ipfsApiUrl: settings.ipfsApiUrl,
		gateway: settings.gateway,
	};

	if (ipfsLoading) {
		return (
			<>
				<h1>Setting up IPFS...</h1>
				<Button onClick={settings.clear}>clear settings</Button>
			</>
		);
	}

	return (
		<Container>
			<Formik
				initialValues={initialValues}
				onSubmit={(values) => {
					settings.setIpfsMode(values.ipfsMode);
					settings.setIpfsApiUrl(values.ipfsApiUrl);
					settings.setGateway(values.gateway);
				}}
			>
				{({ values, handleChange }) => (
					<Form>
						<VStack spacing={2}>
							<FormControl id="gateway">
								<FormLabel>IPFS Gateway Url</FormLabel>
								<Input
									type="url"
									value={values.gateway ?? ""}
									name="gateway"
									onChange={handleChange}
									list="gatewayOptions"
								/>
								<FormHelperText>The URL to the api endpoint of the IPFS node</FormHelperText>
								<datalist id="gatewayOptions">
									<option value="https://ipfs.io" />
									<option value="https://localhost:8080" />
								</datalist>
							</FormControl>
							<FormControl id="ipfsMode">
								<FormLabel>IPFS Mode</FormLabel>
								<Select value={values.ipfsMode ?? ""} name="ipfsMode" onChange={handleChange}>
									<option value="remote">remote</option>
									<option value="local">local</option>
								</Select>
							</FormControl>
							<FormControl id="ipfsApiUrl">
								<FormLabel>Ipfs Api Url</FormLabel>
								<Input type="url" value={values.ipfsApiUrl ?? ""} name="ipfsApiUrl" onChange={handleChange} />
							</FormControl>
							<Button type="submit">save</Button>
						</VStack>
					</Form>
				)}
			</Formik>
		</Container>
	);
};

const SettingsView = () => (
	<PageContainer>
		<SettingsPage />
	</PageContainer>
);

export default SettingsView;
