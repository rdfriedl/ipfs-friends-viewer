import { useMemo } from "react";
import isIpfs from 'is-ipfs';
import { useAppSettings } from "../providers/AppSettingsProvider.js";
import { useIpfsFileFolder, useIpfsFolder } from "./useIpfsFileFolder.js";

const imageTypes = /\.(jpg|jpeg|png|gif)/i;

export function useFolderImages(addressOrPath){
	const thumbsPath = addressOrPath+'/.thumbs';
	const { gateway } = useAppSettings();

	const hookFn = isIpfs.path(addressOrPath) ? useIpfsFolder : useIpfsFileFolder;

	const { data: dir, isLoading: loadingDir } = hookFn(addressOrPath);
	const { data: thumbsDir, isLoading: loadingThumbsDir } = hookFn(thumbsPath);

	const images = useMemo(() => {
		if(dir && !loadingThumbsDir){
			return dir
				.filter(f => f.type === 'file' && imageTypes.test(f.name))
				.map(file => {
					const thumbnail = thumbsDir && thumbsDir.find(f => f.name === file.name);

					return {
						name: file.name,
						src: `${gateway}/ipfs/${file.cid.toString()}`,
						thumbnail: thumbnail && `${gateway}/ipfs/${thumbnail.cid.toString()}`,
						thumbnailWidth: 256,
						thumbnailHeight: 256,
					}
				});
		}
	}, [dir, loadingThumbsDir, thumbsDir]);

	return {
		images,
		loading: loadingDir || loadingThumbsDir
	}
}
