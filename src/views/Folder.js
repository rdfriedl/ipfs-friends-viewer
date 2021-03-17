import React from 'react';
import { useLocation } from 'react-router-dom';

import { PageContainer } from '../components/PageContainer.js';
import { Box, Button, ButtonGroup, Flex } from '@chakra-ui/react';
import { UpButton } from '../components/UpButton.js';
import { useIpfsFileHash } from '../hooks/useIpfsFileHash.js';
import { useGenerateThumbnailsMutation } from '../hooks/useGenerateThumbnailsMutation.js';
import { FolderContents } from '../components/FolderContents.js';
import { LinkButton } from '../components/LinkButton.js';

export const FolderPage = () => {
	const { pathname } = useLocation();
	const path = pathname.replace(/^\/folder/, '') || '/';

	const { data: folderHash, refetch: refetchHash } = useIpfsFileHash(path);

	const { mutate, isLoading } = useGenerateThumbnailsMutation({
		onSuccess: () => refetchHash()
	});

	const handleGenerateClick = () => {
		mutate({ path });
	}

	return (
		<>
			<Box as="nav" w="100%" padding="2">
				<Flex justifyContent="space-between">
					<ButtonGroup>
						<UpButton>Back</UpButton>
						<Button onClick={handleGenerateClick} isLoading={isLoading}>Generate Thumbnails</Button>
						<LinkButton to={`/ipfs/${folderHash}`}>Open in Readonly</LinkButton>
					</ButtonGroup>
				</Flex>
			</Box>
			<FolderContents hash={folderHash}/>
		</>
	)
}

export const FolderView = () => (
	<PageContainer>
		<FolderPage/>
	</PageContainer>
)
