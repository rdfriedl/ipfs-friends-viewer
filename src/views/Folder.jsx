import React from "react";
import { useLocation } from "react-router-dom";

import { PageContainer } from "../components/PageContainer";
import { Box, Button, ButtonGroup, Flex } from "@chakra-ui/react";
import { UpButton } from "../components/UpButton";
import { useIpfsFileHash } from "../hooks/useIpfsFileHash";
import { useGenerateThumbnailsMutation } from "../hooks/useGenerateThumbnailsMutation";
import { FolderContents } from "../components/FolderContents";
import { LinkButton } from "../components/LinkButton";

const FolderPage = ({ pathname }) => {
	const path = pathname.replace(/^\/folder/, "") || "/";
	const { data: folderHash, refetch: refetchHash } = useIpfsFileHash(path);

	const { mutate, isLoading } = useGenerateThumbnailsMutation({
		onSuccess: () => refetchHash(),
	});

	const handleGenerateClick = () => {
		mutate({ path, regenImage: confirm("regen images"), regenFolder: confirm("regen folders"), recursive: true });
	};

	return (
		<>
			<Box as="nav" w="100%" padding="2">
				<Flex justifyContent="space-between">
					<ButtonGroup>
						<UpButton>Back</UpButton>
						<Button onClick={handleGenerateClick} isLoading={isLoading}>
							Generate Thumbnails
						</Button>
						<LinkButton to={`/ipfs/${folderHash}`}>Open in Readonly</LinkButton>
					</ButtonGroup>
				</Flex>
			</Box>
			{folderHash && <FolderContents hash={folderHash} pathname={pathname} />}
		</>
	);
};

const FolderView = () => {
	const { pathname } = useLocation();

	return (
		<PageContainer>
			<FolderPage pathname={pathname} />
		</PageContainer>
	);
};

export default FolderView;
