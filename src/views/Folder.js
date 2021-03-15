import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { PageContainer } from '../components/PageContainer.js';
import { useAppSettings } from '../providers/AppSettingsProvider.js';
import { useIpfs } from '../providers/IpfsProvider.js';
import { useIpfsFileFolder, useIpfsFolder } from '../hooks/useIpfsFileFolder.js';
import { useQuery } from 'react-query';
import { Wrap, WrapItem } from '@chakra-ui/react';
import { FolderCard } from '../components/FolderCard.js';
import { ImageCard } from '../components/ImageCard.js';
import { useFolderImages } from '../hooks/useFolderImages.js';

const imageTypes = /\.(jpg|jpeg|png|gif)/i;

export function loadBlob(url) {
	return fetch(url).then((res) => res.blob());
}
async function ipfsListFolder(ipfs, path, opts){
	const list = ipfs.files.ls(path, opts);

	const entries = [];
	for await (let entry of list){
		entries.push(entry);
	}
	return entries;
}
async function getImagesWithThumbnails({ipfs, thumbor, path, gateway}){
	const contents = await ipfsListFolder(ipfs, path);
	const thumbsPath = path+'/.thumbs';

	const hasThumbsFolder = contents.find(entry => entry.type === 'directory' && entry.name === '.thumbs');
	if(!hasThumbsFolder){
		await ipfs.files.mkdir(thumbsPath);
	}
	const thumbnails = await ipfsListFolder(ipfs, thumbsPath, {type: 'file'});

	const images = [];
	for (let file of contents){
		if(imageTypes.test(file.name)){
			const imageSrc = `${gateway}/ipfs/${file.cid.toString()}`;
			const thumbnail = thumbnails.find(f => f.name === file.name);
			if(!thumbnail && thumbor){
				let blob = await loadBlob(`https://cors.rdfriedl.com/${thumbor}/unsafe/256x256/${encodeURIComponent(imageSrc)}`);
				await ipfs.files.write(`${thumbsPath}/${file.name}`, blob, {create: true});
			}

			images.push({
				file,
				src: imageSrc,
				thumbnail: thumbnail && `${gateway}/ipfs/${thumbnail.cid.toString()}`,
			})
		}
	}

	return images;
}

const FolderCardWithThumbnail = ({name, cid, to}) => {
	const { data: thumbnails } = useIpfsFolder(`/ipfs/${cid}/.thumbs`, {suspense: false});
	const { gateway } = useAppSettings();

	const selectedThumbnails = useMemo(
		() => {
			if(thumbnails){
				return Array.from(thumbnails)
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

export const FolderPage = () => {
	const { ipfs } = useIpfs();
	const { pathname } = useLocation();
	const { gateway, thumbor } = useAppSettings();
	const path = pathname.replace(/^\/folder/, '') || '/';

	const { data: contents = [] } = useIpfsFileFolder(path);

	const subFolders = useMemo(
		() => contents.filter(f => f.type === "directory" && f.name !== '.thumbs'),
		[contents]
	);

	const { data: images = [] } = useQuery(['getImagesWithThumbnails', path], async () => {
		return await getImagesWithThumbnails({ipfs, path, thumbor, gateway})
	}, [ipfs, path, thumbor, gateway]);

	return (
		<div>
			<Wrap>
				{subFolders.map(dir => (
					<WrapItem key={dir.cid.toString()}>
						<FolderCardWithThumbnail name={dir.name} to={`${pathname}/${dir.name}`} cid={dir.cid.toString()}/>
					</WrapItem>
				))}
				{images.map(image => (
					<WrapItem key={image.file.cid.toString()}>
						<ImageCard name={image.file.name} src={image.thumbnail} href={image.src}/>
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
