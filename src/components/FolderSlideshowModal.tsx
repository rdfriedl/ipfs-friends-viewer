import React from "react";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	ButtonGroup,
	Progress,
} from "@chakra-ui/react";
import styled from "styled-components";

import { FileBackup } from "../hooks/useDeviceFolderMetadata";
import { useDecryptedFile } from "../hooks/useDecryptedFile";
import { useObjectUrl } from "../hooks/useObjectUrl";

const PreviewImage = styled.img`
	max-height: 79vh;
`;

type FolderSlideshowModalProps = {
	files: FileBackup[];
	isOpen: boolean;
	index: number;
	setIndex: (index: number) => void;
	onClose: () => void;
};

export const FolderSlideshowModal = ({ files, index = 0, setIndex, isOpen, onClose }: FolderSlideshowModalProps) => {
	const currentImage = files[index];

	const { data, isLoading } = useDecryptedFile(currentImage?.ipfsHash, currentImage?.mimeType);
	const src = useObjectUrl(data);

	return (
		<Modal onClose={onClose} size="6xl" isOpen={isOpen} scrollBehavior="inside">
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Preview</ModalHeader>
				<ModalCloseButton />
				<ModalBody>{isLoading ? <Progress size="xs" isIndeterminate /> : <PreviewImage src={src} />}</ModalBody>
				<ModalFooter>
					<ButtonGroup>
						<Button isDisabled={index === 0} onClick={() => setIndex(index - 1)}>
							Prev
						</Button>
						<Button isDisabled={index + 1 === files.length} onClick={() => setIndex(index + 1)}>
							Next
						</Button>
					</ButtonGroup>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
