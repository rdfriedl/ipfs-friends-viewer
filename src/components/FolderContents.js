import React, { useMemo } from 'react';

import { Wrap, WrapItem } from '@chakra-ui/react';

import { useLocation } from 'react-router-dom';
import { useIpfsFolder } from '../hooks/useIpfsFileFolder.js';
import { useAppSettings } from '../providers/AppSettingsProvider.js';
import { ImageCard } from './ImageCard.js';
import { FolderCard } from './FolderCard.js';
import { imageTypes } from '../const.js';

export const FolderContents = ({ hash, pathname }) => {
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
					<FolderCard
						name={dir.name}
						to={`${pathname}/${dir.name}`}
						thumbnails={[
							`${ipfsPath}/.thumbs/${dir.name}/0`,
							`${ipfsPath}/.thumbs/${dir.name}/1`,
							`${ipfsPath}/.thumbs/${dir.name}/2`,
							`${ipfsPath}/.thumbs/${dir.name}/3`,
						]}
					/>
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
