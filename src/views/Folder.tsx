import React, { useState, useCallback } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { Box, Button, ButtonGroup, Flex } from "@chakra-ui/react";

import { PageContainer } from "../components/PageContainer";
import { UpButton } from "../components/UpButton";
import { FileBackup, FolderBackup, useDeviceFolderMetadata } from "../hooks/useDeviceFolderMetadata";
import { FolderSlideshowModal } from "../components/FolderSlideshowModal";
import { FolderContentsTable } from "../components/FolderContentsTable";
import { useAppSettings } from "../providers/AppSettingsProvider";
import { FolderContentsCards } from "../components/FolderContentsCards";

const PageContent = styled.div`
	overflow-x: hidden;
	overflow-y: auto;
	padding-bottom: 2rem;
`;

type FolderPageProps = {
	ipns: string;
	path: string;
};

const FolderPage = ({ ipns, path }: FolderPageProps) => {
	const history = useHistory();
	const settings = useAppSettings();
	const { data: metadata } = useDeviceFolderMetadata(ipns, path);
	const [slideshowOpen, setSlideshowOpen] = useState(false);
	const [slideshowIndex, setSlideshowIndex] = useState(0);

	const handleFileClick = useCallback(
		(file: FileBackup) => {
			if (metadata) {
				const index = metadata.files.indexOf(file);
				setSlideshowIndex(index);
				setSlideshowOpen(true);
			}
		},
		[metadata, setSlideshowOpen, setSlideshowIndex]
	);
	const handleClickFolder = useCallback(
		(folder: FolderBackup) => {
			history.push(`/device/${ipns}/${path}/${folder.hash}`);
		},
		[history]
	);

	let DisplayComponent = FolderContentsCards;
	if (settings.folderDisplayMode === "table") {
		DisplayComponent = FolderContentsTable;
	}

	return (
		<>
			<Box as="nav" w="100%" padding="2">
				<Flex justifyContent="space-between">
					<ButtonGroup>
						<UpButton>Back</UpButton>
					</ButtonGroup>
					<ButtonGroup isAttached>
						<Button
							colorScheme={settings.folderDisplayMode === "table" ? "blue" : undefined}
							onClick={() => settings.setFolderDisplayMode("table")}
						>
							Table
						</Button>
						<Button
							colorScheme={settings.folderDisplayMode === "cards" ? "blue" : undefined}
							onClick={() => settings.setFolderDisplayMode("cards")}
						>
							Cards
						</Button>
					</ButtonGroup>
				</Flex>
			</Box>
			<PageContent>
				{metadata && (
					<DisplayComponent metadata={metadata} onClickFolder={handleClickFolder} onClickFile={handleFileClick} />
				)}
			</PageContent>
			{metadata && (
				<FolderSlideshowModal
					files={metadata?.files}
					index={slideshowIndex}
					setIndex={setSlideshowIndex}
					isOpen={slideshowOpen}
					onClose={() => setSlideshowOpen(false)}
				/>
			)}
		</>
	);
};

type RouteParams = {
	ipns: string;
};

const FolderView = () => {
	const params = useParams<RouteParams>();
	const { pathname } = useLocation();

	return (
		<PageContainer>
			<FolderPage ipns={params.ipns} path={pathname.replace(/^.+\/files/, "files")} />
		</PageContainer>
	);
};

export default FolderView;
