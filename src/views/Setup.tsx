import React from "react";
import { Formik, Form } from "formik";

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
	useToast,
} from "@chakra-ui/react";
import { PageContainer } from "../components/PageContainer";
import { useKeys } from "../providers/KeysProvider";
import { useHistory } from "react-router-dom";

const SetupPage = () => {
	const toast = useToast();
	const history = useHistory();
	const { importPrivateKey } = useKeys();
	const initialValues = {
		privateKey: "",
		passphrase: "",
	};

	return (
		<Modal isOpen onClose={() => {}} isCentered size="xl">
			<ModalOverlay />
			<ModalContent>
				<Formik
					initialValues={initialValues}
					onSubmit={async (values) => {
						try {
							await importPrivateKey(values.privateKey as string, values.passphrase as string);
							toast({ title: "Imported key", status: "success" });
							history.push("/");
						} catch (e) {
							toast({ title: "Failed to import key", status: "error", description: e.message });
						}
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
									<FormControl id="passphrase">
										<FormLabel>Passphrase</FormLabel>
										<Input
											type="password"
											value={values.passphrase ?? ""}
											name="passphrase"
											onChange={handleChange}
											required
										/>
										<FormHelperText>If the private key already has a passphrase this will be ignored</FormHelperText>
									</FormControl>
								</VStack>
							</ModalBody>
							<ModalFooter>
								<Button colorScheme="blue" type="submit">
									Import
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
