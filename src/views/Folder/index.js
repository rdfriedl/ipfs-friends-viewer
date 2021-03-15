import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAsync } from 'react-use';

import Gallery from 'react-grid-gallery';
import { PageContainer } from '../../components/PageContainer.js';
import { useAppSettings } from '../../providers/AppSettingsProvider.js';
import { useIpfs } from '../../providers/IpfsProvider.js';
import { useBetterAsync } from '../../hooks/useBetterAsync.js';
import { useIpfsFolder } from '../../hooks/useIpfsFolder.js';
import { GalleryProvider } from '../../providers/GalleryProvider.js';
import { useQuery } from 'react-query';

const CurrentFolder = React.createContext('');
const imageTypes = /\.(jpg|jpeg|png)/i;

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
				thumbnailWidth: 1,
				thumbnailHeight: 1,
			})
		}
	}

	return images;
}

export const FolderPage = () => {
	const { ipfs } = useIpfs();
	const { pathname } = useLocation();
	const { gateway, thumbor } = useAppSettings();
	const path = pathname.replace(/^\/folder/, '') || '/';

	const { data: contents = [] } = useIpfsFolder(path);

	const subFolders = useMemo(
		() => contents.filter(f => f.type === "directory" && f.name !== '.thumbs'),
		[contents]
	);

	const { data: images = [] } = useQuery(['getImagesWithThumbnails', path], async () => {
		return await getImagesWithThumbnails({ipfs, path, thumbor, gateway})
	}, [ipfs, path, thumbor, gateway]);

	return (
		<GalleryProvider path={path}>
			<ul>
				{subFolders.map(dir => (
					<li key={dir.cid.toString()}>
						<Link to={`${pathname}/${dir.name}`}>{dir.name}</Link>
					</li>
				))}
			</ul>
			{images.length > 0 && (
				<Gallery images={images} enableImageSelection={false}/>
			)}
		</GalleryProvider>
	)
}

export const FolderView = () => (
	<PageContainer>
		<FolderPage/>
	</PageContainer>
)
