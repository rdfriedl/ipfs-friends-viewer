import React from "react";
import styled from "styled-components";
import { Table, Thead, Tbody, Tr, Th, Td, Button } from "@chakra-ui/react";
import { BackupFolderMetadata, FileBackup, FolderBackup } from "../hooks/useDeviceFolderMetadata";
import { useAppSettings } from "../providers/AppSettingsProvider";
import { CopyableText } from "./CopyableText";

const ClickableData = styled(Td)`
	cursor: ${({ onClick }) => (onClick ? "pointer" : "initial")};

	&:hover,
	&:focus {
		background-color: rgba(0, 0, 0, 0.1);
	}
`;

export type FolderContentsTableProps = {
	metadata: BackupFolderMetadata;
	onClickFolder?: (folder: FolderBackup) => void;
	onClickFile?: (file: FileBackup) => void;
};

export const FolderContentsTable = ({ metadata, onClickFolder, onClickFile }: FolderContentsTableProps) => {
	const { gateway } = useAppSettings();
	return (
		<Table variant="simple" size="sm">
			<Thead>
				<Tr>
					<Th>Name</Th>
					<Th>IPFS Hash</Th>
					<Th isNumeric />
				</Tr>
			</Thead>
			<Tbody>
				{metadata.folders.map((folder) => (
					<Tr key={folder.hash}>
						<ClickableData
							onClick={onClickFolder ? () => onClickFolder(folder) : undefined}
							tabIndex={onClickFolder ? 0 : undefined}
						>
							{folder.name}
						</ClickableData>
						<Td>--</Td>
						<Td isNumeric>--</Td>
					</Tr>
				))}
				{metadata.files.map((file) => (
					<Tr key={file.filename + "-" + file.fileHash}>
						<ClickableData
							onClick={onClickFile ? () => onClickFile(file) : undefined}
							tabIndex={onClickFolder ? 0 : undefined}
						>
							{file.filename}
						</ClickableData>
						<Td>
							<CopyableText>{file.ipfsHash}</CopyableText>
						</Td>
						<Td isNumeric>
							<Button
								as="a"
								colorScheme="teal"
								size="xs"
								href={new URL(`/ipfs/${file.ipfsHash}?filename=${file.filename}.gpg`, gateway).href}
								target="_blank"
							>
								Download
							</Button>
						</Td>
					</Tr>
				))}
			</Tbody>
		</Table>
	);
};
