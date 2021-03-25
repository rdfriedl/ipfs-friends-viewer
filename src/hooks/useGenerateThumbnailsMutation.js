import { useMutation } from "react-query";
import { useAppSettings } from "../providers/AppSettingsProvider";
import { useIpfs } from "../providers/IpfsProvider";
import { imageTypes } from '../const';

const FOLDER_THUMB_SIZE = '200x200';
const IMAGE_THUMB_SIZE = '200x0';

export function loadBlob(url) {
	return fetch(url).then((res) => res.blob());
}
async function ipfsCopyUrlToPath(ipfs, url, path) {
	const blob = await loadBlob(url);
	await ipfs.files.write(path, blob, {create: true});
}
async function ipfsListPath(ipfs, path, opts){
	const list = ipfs.files.ls(path, opts);

	const entries = [];
	for await (let entry of list){
		entries.push(entry);
	}
	return entries;
}
function isSubFolder(entry){
	return entry.type === 'directory' && entry.name !== '.thumbs';
}
function isImage(entry){
	return entry.type === 'file' && imageTypes.test(entry.name);
}

async function ipfsEnsureDir(ipfs, path){
	const exists = await ipfsFileExists(ipfs, path);

	if(!exists){
		await ipfs.files.mkdir(path, { parents: true });
	}
}
async function ipfsFileExists(ipfs, path) {
	try {
		const stats = await ipfs.files.stat(path, {hash: true});

		return !!stats.cid;
	}
	catch(e){
		return false;
	}
}

async function getFolderThumbnailFiles(ipfs, path){
	const thumbsPath = path+'/.thumbs'
	const existingThumbnails = await ipfsListPath(ipfs, thumbsPath);

	const thumbnailImageFiles = [];
	while(thumbnailImageFiles.length < 4 && existingThumbnails.length > 0){
		const entry = existingThumbnails.shift();

		switch(entry.type){
			case 'file':
				thumbnailImageFiles.push(entry);
				break;
			case 'directory':
				const thumbs = await ipfsListPath(ipfs, thumbsPath+'/'+entry.name);
				const imageFile = thumbs.find(Boolean);
				if(imageFile){
					thumbnailImageFiles.push(imageFile);
				}
				break;
		}
	}

	return thumbnailImageFiles;
}

async function generateSubDirThumbnails(ctx, folder, dir){
	const { ipfs, gateway, thumbor } = ctx;
	const thumbFolderPath = `${folder}/.thumbs/${dir}`;

	await ipfsEnsureDir(ipfs, thumbFolderPath);

	const thumbImageFiles = await getFolderThumbnailFiles(ipfs, folder+'/'+dir);

	for(let i = 0; i < thumbImageFiles.length; i++){
		const imageFile = thumbImageFiles[i];
		const imageSrc = `${gateway}/ipfs/${imageFile.cid.toString()}`;
		const url = `https://cors.rdfriedl.com/${thumbor}/unsafe/${FOLDER_THUMB_SIZE}/${encodeURIComponent(imageSrc)}`;

		await ipfsCopyUrlToPath(ipfs, url, thumbFolderPath+'/'+i);
	}
}

async function generateImageThumbnail(ctx, folder, imageFile) {
	const { ipfs, gateway, thumbor } = ctx;
	const thumbsPath = folder+'/.thumbs';

	const imageSrc = `${gateway}/ipfs/${imageFile.cid.toString()}`;
	const thumbPath = `${thumbsPath}/${imageFile.name}`;
	const thumbUrl = `https://cors.rdfriedl.com/${thumbor}/unsafe/${IMAGE_THUMB_SIZE}/${encodeURIComponent(imageSrc)}`;

	await ipfsCopyUrlToPath(ipfs, thumbUrl, thumbPath);
}

async function generateThumbnails(ctx, folder){
	const { ipfs, recursive, regenFolder, regenImage } = ctx;
	const thumbsPath = folder+'/.thumbs';

	const contents = await ipfsListPath(ipfs, folder);

	const subFolders = contents.filter(isSubFolder);
	const images = contents.filter(isImage);

	await ipfsEnsureDir(ipfs, thumbsPath);
	const existingThumbnails = await ipfsListPath(ipfs, thumbsPath);

	for (let imageFile of images){
		const exists = existingThumbnails.find(f => f.name === imageFile.name);
		if(!exists || regenImage){
			try {
				await generateImageThumbnail(ctx, folder, imageFile);
				console.log(`generating thumbnail for image ${imageFile.name}`);
			}
			catch(e){
				console.error(`failed to generate thumbnail for ${imageFile.name}`);
				console.log(e);
			}
		}
	}

	for(let subFolder of subFolders){
		if(recursive){
			try {
				await generateThumbnails(ctx, folder+'/'+subFolder.name);
			}
			catch(e){
				console.error(`failed to recurse through sub folder "${subFolder.name}"`);
				console.log(e);
			}
		}

		const thumbsExist = existingThumbnails.find(f => f.name === subFolder.name);
		if(!thumbsExist || regenFolder){
			try {
				await generateSubDirThumbnails(ctx, folder, subFolder.name);
				console.log(`generated thumbnails for sub folder ${subFolder.name}`);
			}
			catch(e){
				console.error(`failed to generate sub folder thumbnails for "${subFolder.name}" in "${folder}"`);
				console.log(e);
			}
		}
	}
}

export const useGenerateThumbnailsMutation = (opts) => {
	const { ipfs } = useIpfs();
	const { gateway, thumbor } = useAppSettings();

	return useMutation(async ({path, regenFolder = false, regenImage = false, recursive = false}) => {
		if(!gateway || !thumbor){
			throw new Error('missing gateway or thumbor settings');
		}

		const ctx = {
			ipfs, gateway, thumbor, regenFolder, regenImage, recursive
		};
		await generateThumbnails(ctx, path);
	}, opts);
}
