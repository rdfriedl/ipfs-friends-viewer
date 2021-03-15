import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAsync } from 'react-use';

import Gallery from 'react-grid-gallery';
import { PageContainer } from '../../components/PageContainer.js';
import { useAppSettings } from '../../providers/AppSettingsProvider.js';
import { useIpfs } from '../../providers/IpfsProvider.js';

const CurrentFolder = React.createContext('');
const imageTypes = /\.(jpg|jpeg|png)/i;

export const FolderPage = () => {
	const { ipfs } = useIpfs();
	const { pathname } = useLocation();
	const { gateway, thumbor } = useAppSettings();
	const path = pathname.replace(/^\/folder/, '') || '/';

	const {value: contents = [], loading, error} = useAsync(async () => {
		const list = ipfs.files.ls(path);

		const entries = [];
		for await (let entry of list){
			entries.push(entry);
		}
		return entries;
	}, [ipfs, path]);

	const subFolders = useMemo(() => contents.filter(entry => entry.type === 'directory'), [contents]);
	const files = useMemo(() => contents.filter(entry => entry.type === 'file'), [contents]);
	const images = useMemo(() => {
		return files
			.filter(file => imageTypes.test(file.name))
			.map(file => {
				const src = `${gateway}/ipfs/${file.cid.toString()}`;

				return ({
					src,
					thumbnail: thumbor ? `${thumbor}/unsafe/128x128/${encodeURIComponent(src)}` : null,
					thumbnailWidth: 1,
					thumbnailHeight: 1,
				})
			})
	}, [files]);

	return (
		<CurrentFolder.Provider value={path}>
			<ul>
				{subFolders.map(dir => (
					<li key={dir.cid.toString()}>
						<Link to={`${pathname}/${dir.name}`}>{dir.name}</Link>
					</li>
				))}
			</ul>
			<Gallery images={images} enableImageSelection={false}/>
		</CurrentFolder.Provider>
	)
}

export const FolderView = () => (
	<PageContainer>
		<FolderPage/>
	</PageContainer>
)
