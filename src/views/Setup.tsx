import React from "react";
import { Formik, Form } from "formik";
import { encryptKey, readPrivateKey } from "openpgp";

import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	Input,
	Button,
	FormControl,
	FormLabel,
	FormHelperText,
	ModalFooter,
	Textarea,
	VStack,
} from "@chakra-ui/react";
import { useAppSettings } from "../providers/AppSettingsProvider";
import { PageContainer } from "../components/PageContainer";

const SetupPage = () => {
	const settings = useAppSettings();
	const initialValues = {
		email: settings.email,
		privateKey: settings.privateKey,
		password: "",
	};

	return (
		<Modal isOpen onClose={() => {}} isCentered size="xl">
			<ModalOverlay />
			<ModalContent>
				<Formik
					initialValues={initialValues}
					onSubmit={async (values) => {
						try {
							const privateKey = await encryptKey({
								privateKey: await readPrivateKey({ armoredKey: values.privateKey as string }),
								passphrase: values.password as string,
							});
							settings.setPrivateKey(privateKey.armor());
						} catch (e) {}
					}}
				>
					{({ values, handleChange }) => (
						<Form>
							<ModalHeader>Setup</ModalHeader>
							<ModalBody>
								<VStack>
									<FormControl id="privateKey">
										<FormLabel>Private Key</FormLabel>
										<Textarea value={values.privateKey ?? ""} name="privateKey" onChange={handleChange} required />
									</FormControl>
									<FormControl id="password">
										<FormLabel>password</FormLabel>
										<Input
											type="password"
											value={values.password ?? ""}
											name="password"
											onChange={handleChange}
											required
										/>
										<FormHelperText>
											This password will be used to protect the private key when its being stored
										</FormHelperText>
									</FormControl>
								</VStack>
							</ModalBody>
							<ModalFooter>
								<Button colorScheme="blue" type="submit">
									Setup
								</Button>
							</ModalFooter>
						</Form>
					)}
				</Formik>
			</ModalContent>
		</Modal>
	);
};

const SetupView = () => (
	<PageContainer>
		<SetupPage />
	</PageContainer>
);

export default SetupView;
