import React, { useRef } from "react";
import { Formik, Form } from "formik";

import {
	Box,
	Flex,
	ButtonGroup,
	Button,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverArrow,
	PopoverCloseButton,
	Portal,
	PopoverHeader,
	PopoverBody,
	PopoverFooter,
	FormControl,
	FormLabel,
	Input,
	useToast,
} from "@chakra-ui/react";
import { LinkButton } from "./LinkButton";
import { useKeys } from "../providers/KeysProvider";

const UnlockKeyModal: React.FC = ({ children }) => {
	const toast = useToast();
	const { unlockKey } = useKeys();
	const initialFocusRef = useRef<HTMLInputElement>(null);

	const initialValues = {
		passphrase: "",
	};

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={async ({ passphrase }) => {
				try {
					await unlockKey(passphrase);
					toast({ title: "Unlocked Key!", status: "success" });
				} catch (e) {
					toast({ title: "Failed to decrypt key", status: "error", description: e.message });
				}
			}}
		>
			{({ values, handleChange }) => (
				<Popover initialFocusRef={initialFocusRef}>
					<PopoverTrigger>{children}</PopoverTrigger>
					<Portal>
						<PopoverContent>
							<Form>
								<PopoverArrow />
								<PopoverHeader>Unlock private key</PopoverHeader>
								<PopoverCloseButton />
								<PopoverBody>
									<FormControl id="passphrase">
										<FormLabel>Passphrase</FormLabel>
										<Input
											type="password"
											name="passphrase"
											value={values.passphrase}
											onChange={handleChange}
											ref={initialFocusRef}
										/>
									</FormControl>
								</PopoverBody>
								<PopoverFooter>
									<Button type="submit">Unlock</Button>
								</PopoverFooter>
							</Form>
						</PopoverContent>
					</Portal>
				</Popover>
			)}
		</Formik>
	);
};

const KeyButton = () => {
	const { locked, setup, reset } = useKeys();

	if (!setup) {
		return (
			<LinkButton colorScheme="red" to="/setup">
				Setup
			</LinkButton>
		);
	} else if (locked) {
		return (
			<UnlockKeyModal>
				<Button colorScheme="red">Unlock</Button>
			</UnlockKeyModal>
		);
	} else {
		return (
			<Button colorScheme={locked ? "red" : "green"} onClick={reset}>
				Details
			</Button>
		);
	}
};

export const Header: React.FC = () => (
	<Box as="nav" w="100%" padding="2">
		<Flex justifyContent="space-between">
			<ButtonGroup>
				<LinkButton to="/">Home</LinkButton>
				<LinkButton to="/folder">Browse</LinkButton>
				<LinkButton to="/settings">Settings</LinkButton>
			</ButtonGroup>
			<ButtonGroup>
				<KeyButton />
			</ButtonGroup>
		</Flex>
	</Box>
);
