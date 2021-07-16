import React, { Suspense } from "react";
import { useLocation } from "react-router-dom";
import isIpfs from "is-ipfs";

import { Box, ButtonGroup, Flex } from "@chakra-ui/react";
import { FolderContents } from "../components/FolderContents";
import { PageContainer } from "../components/PageContainer";
import { UpButton } from "../components/UpButton";
import { useIpfsFileHash } from "../hooks/useIpfsFileHash";

const isRootIpfsPath = /\/ip(fs|ns)\/[^\/]+$/i;

const ReadonlyGalleryPage = () => {
	const { pathname } = useLocation();
	const { data: folderHash } = useIpfsFileHash(pathname);

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
			{folderHash && <FolderContents hash={folderHash} pathname={pathname} />}
		</div>
	);
};

const ReadonlyGalleryView = () => (
	<PageContainer>
		<ReadonlyGalleryPage />
	</PageContainer>
);

export default ReadonlyGalleryView;
