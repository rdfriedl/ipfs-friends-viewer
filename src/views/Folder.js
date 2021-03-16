import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { PageContainer } from '../components/PageContainer.js';
import { useAppSettings } from '../providers/AppSettingsProvider.js';
import { useIpfsFileFolder, useIpfsFolder } from '../hooks/useIpfsFileFolder.js';
import { Box, Button, ButtonGroup, Flex, Wrap, WrapItem } from '@chakra-ui/react';
import { FolderCard } from '../components/FolderCard.js';
import { ImageCard } from '../components/ImageCard.js';
import { UpButton } from '../components/UpButton.js';
import { imageTypes } from '../const.js';
import { useIpfsFileHash } from '../hooks/useIpfsFileHash.js';
import { useGenerateThumbnailsMutation } from '../hooks/useGenerateThumbnailsMutation.js';

const FolderCardWithThumbnail = ({name, cid, to}) => {
	const { data: thumbnails } = useIpfsFolder(`/ipfs/${cid}/.thumbs`, {suspense: false});
	const { gateway } = useAppSettings();

	const selectedThumbnails = useMemo(
		() => {
			if(thumbnails){
				return Array.from(thumbnails)
					.sort(() => Math.random() - 0.5)
					.splice(0,4)
					.filter(Boolean)
					.map(file => `${gateway}/ipfs/${file.cid.toString()}`);
			}
		},
		[ thumbnails ]
	);

	return (
		<FolderCard name={name} to={to} thumbnails={selectedThumbnails}/>
	)
}

const Toolbar = ({folder, onRegenThumbnails}) => {
	const { mutate, isLoading } = useGenerateThumbnailsMutation({
		onSuccess: onRegenThumbnails
	});

	const handleGenerateClick = () => {
		mutate({path: folder, regenAll: true});
	}

	return (
		<Box as="nav" w="100%" padding="2">
			<Flex justifyContent="space-between">
				<ButtonGroup>
					<UpButton>Back</UpButton>
					<Button onClick={handleGenerateClick} isLoading={isLoading}>Generate Thumbnails</Button>
				</ButtonGroup>
			</Flex>
		</Box>
	)
}

export const FolderPage = () => {
	const { pathname } = useLocation();
	const { gateway } = useAppSettings();
	const path = pathname.replace(/^\/folder/, '') || '/';

	const { data: folderHash, refetch: refetchHash } = useIpfsFileHash(path);
	const folderIpfsPath = `${gateway}/ipfs/${folderHash}`;

	const { data: contents = [] } = useIpfsFileFolder(path);

	const subFolders = useMemo(
		() => contents.filter(f => f.type === "directory" && f.name !== '.thumbs'),
		[contents]
	);

	const images = useMemo(
		() => contents.filter(f => f.type === 'file' && imageTypes.test(f.name)),
		[contents]
	);

	const onRegenSuccess = () => refetchHash();

	return (
		<div>
			<Toolbar folder={path} onRegenThumbnails={onRegenSuccess}/>
			<Wrap>
				{subFolders.map(dir => (
					<WrapItem key={dir.cid.toString()}>
						<FolderCardWithThumbnail name={dir.name} to={`${pathname}/${dir.name}`} cid={dir.cid.toString()}/>
					</WrapItem>
				))}
				{images.map(image => (
					<WrapItem key={image.cid.toString()}>
						<ImageCard name={image.name} src={`${folderIpfsPath}/.thumbs/${image.name}`} href={`${folderIpfsPath}/${image.name}`}/>
					</WrapItem>
				))}
			</Wrap>
		</div>
	)
}

export const FolderView = () => (
	<PageContainer>
		<FolderPage/>
	</PageContainer>
)
