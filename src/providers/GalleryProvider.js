import React, { useMemo } from 'react';
import { useIpfsFolder } from '../hooks/useIpfsFolder.js';
import { useAppSettings } from './AppSettingsProvider.js';

const GalleryContext = React.createContext({});

export const GalleryProvider = ({path, children}) => {
	const thumbsPath = path+'/.thumbs';
	const { gateway } = useAppSettings();

	const { data: dir, isLoading: loadingDir } = useIpfsFolder(path);
	const { data: thumbsDir, isLoading: loadingThumbsDir } = useIpfsFolder(thumbsPath);

	const images = useMemo(() => {
		if(dir && thumbsDir){
			return dir
				.filter(f => f.type === 'file')
				.map(file => {
					const thumbnail = thumbsDir.find(f => f.name === file.name);

					return {
						src: `${gateway}/ipfs/${file.cid.toString()}`,
						thumbnail: thumbnail && `${gateway}/ipfs/${thumbnail.cid.toString()}`,
						thumbnailWidth: 256,
						thumbnailHeight: 256,
					}
				});
		}
	}, [dir, thumbsDir]);

	const context = {
		images,
		loading: loadingDir || loadingThumbsDir
	};

	return (
		<GalleryContext.Provider value={context}>
			{children}
		</GalleryContext.Provider>
	)
};
