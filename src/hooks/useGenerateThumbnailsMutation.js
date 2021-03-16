import { useMutation } from "react-query";
import { useAppSettings } from "../providers/AppSettingsProvider.js";
import { useIpfs } from "../providers/IpfsProvider.js";
import { imageTypes } from '../const';

export function loadBlob(url) {
	return fetch(url).then((res) => res.blob());
}
async function ipfsListPath(ipfs, path, opts){
	const list = ipfs.files.ls(path, opts);

	const entries = [];
	for await (let entry of list){
		entries.push(entry);
	}
	return entries;
}
export const useGenerateThumbnailsMutation = (opts) => {
	const { ipfs } = useIpfs();
	const { gateway, thumbor } = useAppSettings();

	return useMutation(async ({path, regenAll = false}) => {
		if(!gateway || !thumbor){
			throw new Error('missing gateway or thumbor settings');
		}

		const contents = await ipfsListPath(ipfs, path);
		const thumbsPath = path+'/.thumbs';

		const hasThumbsFolder = contents.find(entry => entry.type === 'directory' && entry.name === '.thumbs');
		if(!hasThumbsFolder){
			await ipfs.files.mkdir(thumbsPath);
		}
		const existingThumbnails = await ipfsListPath(ipfs, thumbsPath, {type: 'file'});

		for (let file of contents){
			if(imageTypes.test(file.name)){
				const thumbPath = `${thumbsPath}/${file.name}`;

				const existingThumbnail = existingThumbnails.find(f => f.name === file.name);
				if(!existingThumbnail || regenAll){
					const imageSrc = `${gateway}/ipfs/${file.cid.toString()}`;
					const blob = await loadBlob(`https://cors.rdfriedl.com/${thumbor}/unsafe/256x0/${encodeURIComponent(imageSrc)}`);

					await ipfs.files.write(thumbPath, blob, {create: true});
					console.info(`wrote ${thumbPath}`);
				}
			}
		}
	}, opts);
}
