import React from "react";
import { Link, LinkProps } from "react-router-dom";
import { WrapItem, BoxProps, Box, Wrap, LinkOverlay, LinkBox } from "@chakra-ui/react";
import { BackupFolderMetadata, FileBackup, FolderBackup } from "../hooks/useDeviceFolderMetadata";

const Card: React.FC<BoxProps> = ({ children, onClick, ...props }) => (
	<Box
		{...props}
		borderWidth="1px"
		borderRadius="lg"
		overflow="hidden"
		py="2"
		px="4"
		cursor={onClick ? "pointer" : "initial"}
		onClick={onClick}
	>
		{children}
	</Box>
);

export type LinkCardProps = BoxProps & {
	to: LinkProps["to"];
};

export const LinkCard: React.FC<LinkCardProps> = ({ children, to, ...props }) => (
	<LinkBox maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
		<Card {...props}>
			<LinkOverlay as={Link} to={to}>
				{children}
			</LinkOverlay>
		</Card>
	</LinkBox>
);

export type FolderContentsCardsProps = {
	metadata: BackupFolderMetadata;
	onClickFolder?: (folder: FolderBackup) => void;
	onClickFile?: (file: FileBackup) => void;
};

export const FolderContentsCards = ({ metadata, onClickFolder, onClickFile }: FolderContentsCardsProps) => (
	<Wrap>
		{metadata?.folders.map((folder) => (
			<WrapItem key={folder.hash}>
				<Card onClick={onClickFolder ? () => onClickFolder(folder) : undefined}>{folder.name}</Card>
			</WrapItem>
		))}
		{metadata?.files.map((file) => (
			<WrapItem key={file.filename + "-" + file.fileHash}>
				<Card onClick={onClickFile ? () => onClickFile(file) : undefined}>{file.filename}</Card>
			</WrapItem>
		))}
	</Wrap>
);
