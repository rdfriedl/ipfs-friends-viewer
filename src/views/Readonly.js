import React from 'react';
import { useLocation } from 'react-router-dom';
import isIpfs, { path } from 'is-ipfs';

import { Box, ButtonGroup, Flex } from '@chakra-ui/react';
import { FolderContents } from '../components/FolderContents.js';
import { PageContainer } from '../components/PageContainer.js';
import { UpButton } from '../components/UpButton.js';
import { useIpfsFileHash } from '../hooks/useIpfsFileHash.js';

const isRootIpfsPath = /\/ip(fs|ns)\/[^\/]+$/i;

export const ReadonlyGalleryPage = () => {
	const { pathname } = useLocation();
	const { data: folderHash, isLoading } = useIpfsFileHash(pathname);

	const canGoUp = isIpfs.path(pathname) && !isRootIpfsPath.test(pathname);

	return (
		<div>
			<Box as="nav" w="100%" padding="2">
				<Flex justifyContent="space-between">
					{canGoUp && (
						<ButtonGroup>
							<UpButton>Back</UpButton>
						</ButtonGroup>
					)}
				</Flex>
			</Box>
			<FolderContents hash={folderHash}/>
		</div>
	)
}

export const ReadonlyGalleryView = () => (
	<PageContainer>
		<ReadonlyGalleryPage/>
	</PageContainer>
)
