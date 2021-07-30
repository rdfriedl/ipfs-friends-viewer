import React, { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import { PageContainer } from "../components/PageContainer";
import { Box, ButtonGroup, Flex, Wrap, WrapItem } from "@chakra-ui/react";
import { UpButton } from "../components/UpButton";
import { useDeviceFolderMetadata } from "../hooks/useDeviceFolderMetadata";
import { FolderCard } from "../components/FolderCard";
import { FolderSlideshowModal } from "../components/FolderSlideshowModal";

type FolderPageProps = {
	ipns: string;
	path: string;
};

const FolderPage = ({ ipns, path }: FolderPageProps) => {
	const { data: metadata } = useDeviceFolderMetadata(ipns, path);
	const [slideshowOpen, setSlideshowOpen] = useState(false);
	const [slideshowIndex, setSlideshowIndex] = useState(0);

	return (
		<>
			<Box as="nav" w="100%" padding="2">
				<Flex justifyContent="space-between">
					<ButtonGroup>
						<UpButton>Back</UpButton>
					</ButtonGroup>
				</Flex>
			</Box>
			<Wrap>
				{metadata?.folders.map((folder) => (
					<WrapItem key={folder.hash}>
						<FolderCard name={folder.name} to={`/device/${ipns}/${path}/${folder.hash}`} />
					</WrapItem>
				))}
				{metadata?.files.map((file, index) => (
					<WrapItem key={file.fileHash}>
						<Box
							borderWidth="1px"
							borderRadius="lg"
							overflow="hidden"
							py="2"
							px="4"
							onClick={() => {
								setSlideshowIndex(index);
								setSlideshowOpen(true)
							}}
						>
							{file.filename}
						</Box>
					</WrapItem>
				))}
			</Wrap>
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
