import React from "react";
import styled from "styled-components";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { BackupFolderMetadata, FileBackup, FolderBackup } from "../hooks/useDeviceFolderMetadata";

const ClickableTr = styled(Tr)`
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
					<ClickableTr
						key={folder.hash}
						onClick={onClickFolder ? () => onClickFolder(folder) : undefined}
						tabIndex={onClickFolder ? 0 : undefined}
					>
						<Td>{folder.name}</Td>
						<Td>--</Td>
						<Td isNumeric>--</Td>
					</ClickableTr>
				))}
				{metadata.files.map((file) => (
					<ClickableTr
						key={file.fileHash}
						onClick={onClickFile ? () => onClickFile(file) : undefined}
						tabIndex={onClickFolder ? 0 : undefined}
					>
						<Td>{file.filename}</Td>
						<Td>
							<code>{file.ipfsHash}</code>
						</Td>
						<Td isNumeric>--</Td>
					</ClickableTr>
				))}
			</Tbody>
		</Table>
	);
};
