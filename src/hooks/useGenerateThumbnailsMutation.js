import { useMutation } from "react-query";
import { useAppSettings } from "../providers/AppSettingsProvider.js";
import { useIpfs } from "../providers/IpfsProvider.js";
import { imageTypes } from '../const';
import { isFunction } from "util";

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

async function generateSubDirThumbnails(ctx, folder, dir){
	const { ipfs, gateway, thumbor, regenAll } = ctx;
	const contents = await ipfsListPath(ipfs, folder+'/'+dir);
	const images = contents.filter(isImage);
	const thumbFolderPath = `${folder}/.thumbs/${dir}`;

	await ipfsEnsureDir(ipfs, thumbFolderPath);

	const existingThumbnails = await ipfsListPath(ipfs, thumbFolderPath);

	for(let i = 0; i < Math.min(images.length, 4); i++){
		const image = images[i];
		const exists = !!existingThumbnails.find(f => f.name === i);

		if(!exists || regenAll){
			const imageSrc = `${gateway}/ipfs/${image.cid.toString()}`;
			const thumbPath = thumbFolderPath+'/'+i
			const thumbUrl = `https://cors.rdfriedl.com/${thumbor}/unsafe/128x128/${encodeURIComponent(imageSrc)}`;

			await ipfsCopyUrlToPath(ipfs, thumbUrl, thumbPath);
		}
	}
}

async function generateImageThumbnails(ctx, folder) {
	const { ipfs, gateway, thumbor, regenAll } = ctx;
	const thumbsPath = folder+'/.thumbs';

	const contents = await ipfsListPath(ipfs, folder);
	const images = contents.filter(isImage);

	await ipfsEnsureDir(ipfs, thumbsPath);

	const existingThumbnails = await ipfsListPath(ipfs, thumbsPath, {type: 'file'});

	for (let image of images){
		try {
			const exists = existingThumbnails.find(f => f.name === image.name);

			if(!exists || regenAll){
				console.log(`generating thumbnail for ${image.name}`);

				const imageSrc = `${gateway}/ipfs/${image.cid.toString()}`;
				const thumbPath = `${thumbsPath}/${image.name}`;
				const thumbUrl = `https://cors.rdfriedl.com/${thumbor}/unsafe/256x0/${encodeURIComponent(imageSrc)}`;

				await ipfsCopyUrlToPath(ipfs, thumbUrl, thumbPath);
			}
		}
		catch(e){
			console.error(`failed to generate thumbnail for ${image.name}`);
		}
	}
}

async function generateThumbnails(ctx, folder){
	const { ipfs, recursive } = ctx;
	console.log(`generating thumbnails for ${folder}`);

	try {
		await generateImageThumbnails(ctx, folder);
	}
	catch(e){
		console.error(`failed to generate image thumbnails for ${folder}`);
	}

	const contents = await ipfsListPath(ipfs, folder);
	const subFolders = contents.filter(isSubFolder);

	for(let subFolder of subFolders){
		try {
			if(recursive){
				await generateThumbnails(ctx, folder+'/'+subFolder.name);
			}

			await generateSubDirThumbnails(ctx, folder, subFolder.name);
		}
		catch(e){
			console.error(`failed to generate sub folder thumbnails for "${subFolder.name}" in "${folder}"`);
			console.log(e);
		}
	}
}

export const useGenerateThumbnailsMutation = (opts) => {
	const { ipfs } = useIpfs();
	const { gateway, thumbor } = useAppSettings();

	return useMutation(async ({path, regenAll = false, recursive = false}) => {
		if(!gateway || !thumbor){
			throw new Error('missing gateway or thumbor settings');
		}

		const ctx = {
			ipfs, gateway, thumbor, regenAll, recursive
		};
		await generateThumbnails(ctx, path);
	}, opts);
}
