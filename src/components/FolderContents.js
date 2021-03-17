import React, { useMemo } from 'react';

import { Wrap, WrapItem } from '@chakra-ui/react';

import { useLocation } from 'react-router-dom';
import { useIpfsFolder } from '../hooks/useIpfsFileFolder.js';
import { useAppSettings } from '../providers/AppSettingsProvider.js';
import { ImageCard } from './ImageCard.js';
import { FolderCard } from './FolderCard.js';
import { imageTypes } from '../const.js';

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

export const FolderContents = ({hash}) => {
	const { pathname } = useLocation();
	const { gateway } = useAppSettings();
	const { data: contents = [] } = useIpfsFolder(hash);
	const ipfsPath = `${gateway}/ipfs/${hash}`;

	const subFolders = useMemo(
		() => contents.filter(f => f.type === "dir" && f.name !== '.thumbs'),
		[contents]
	);

	const images = useMemo(
		() => contents.filter(f => f.type === 'file' && imageTypes.test(f.name)),
		[contents]
	);

	return (
		<Wrap>
			{subFolders.map(dir => (
				<WrapItem key={dir.cid.toString()}>
					<FolderCardWithThumbnail name={dir.name} to={`${pathname}/${dir.name}`} cid={dir.cid.toString()}/>
				</WrapItem>
			))}
			{images.map(image => (
				<WrapItem key={image.cid.toString()}>
					<ImageCard name={image.name} src={`${ipfsPath}/.thumbs/${image.name}`} href={`${ipfsPath}/${image.name}`}/>
				</WrapItem>
			))}
		</Wrap>
	)
}
