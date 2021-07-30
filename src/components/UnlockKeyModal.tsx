import React, { useRef } from "react";
import { Formik, Form } from "formik";
import { useHistory } from "react-router-dom";

import {
	Button,
	FormControl,
	FormLabel,
	Input,
	useToast,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@chakra-ui/react";
import { useKeys } from "../providers/KeysProvider";

const noop = () => {};

export type UnlockKeyModalProps = {
	isOpen: boolean;
	onClose?: () => void;
	onUnlock?: () => void;
	onReset?: () => void;
};

export const UnlockKeyModal = ({ isOpen, onClose = noop, onUnlock, onReset }: UnlockKeyModalProps) => {
	const toast = useToast();
	const { unlockKey, reset } = useKeys();
	const initialFocus = useRef<HTMLInputElement>(null);

	const initialValues = {
		passphrase: "",
	};

	const handleDeleteKey = () => {
		reset();
		onReset && onReset();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialFocus} isCentered>
			<ModalOverlay />
			<ModalContent>
				<Formik
					initialValues={initialValues}
					onSubmit={async ({ passphrase }) => {
						try {
							await unlockKey(passphrase);
							toast({ title: "Unlocked Key!", status: "success" });
							onUnlock && onUnlock();
						} catch (e) {
							toast({ title: "Failed to decrypt key", status: "error", description: e.message });
						}
					}}
				>
					{({ values, handleChange }) => (
						<Form>
							<ModalHeader>Unlock private key</ModalHeader>
							<ModalBody>
								<FormControl id="passphrase">
									<FormLabel>Passphrase</FormLabel>
									<Input
										type="password"
										name="passphrase"
										value={values.passphrase}
										onChange={handleChange}
										ref={initialFocus}
									/>
								</FormControl>
							</ModalBody>

							<ModalFooter>
								<Button type="button" onClick={handleDeleteKey} mr="3">
									Delete key
								</Button>
								<Button colorScheme="blue" type="submit">
									Unlock
								</Button>
							</ModalFooter>
						</Form>
					)}
				</Formik>
			</ModalContent>
		</Modal>
	);
};
