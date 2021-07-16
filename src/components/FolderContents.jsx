import React, { useCallback, useMemo } from "react";
import { SRLWrapper, useLightbox } from "simple-react-lightbox";
import { useEvent } from "react-use";

import { Wrap, WrapItem } from "@chakra-ui/react";

import { useIpfsFolder } from "../hooks/useIpfsFileFolder";
import { useAppSettings } from "../providers/AppSettingsProvider";
import { ImageCard } from "./ImageCard";
import { FolderCard } from "./FolderCard";
import { imageTypes } from "../const";

const preventDefault = (fn) => (e) => {
	e.preventDefault();
	fn(e);
};

export const FolderContents = ({ hash, pathname }) => {
	const { openLightbox, closeLightbox } = useLightbox();
	const { gateway } = useAppSettings();
	const { data: contents = [] } = useIpfsFolder(hash);
	const ipfsPath = `${gateway}/ipfs/${hash}`;

	const subFolders = useMemo(() => contents.filter((f) => f.type === "dir" && f.name !== ".thumbs"), [contents]);

	const images = useMemo(() => contents.filter((f) => f.type === "file" && imageTypes.test(f.name)), [contents]);

	const elements = images.map((image) => ({
		caption: image.name,
		src: `${ipfsPath}/${image.name}`,
		thumbnail: `${ipfsPath}/.thumbs/${image.name}`,
	}));

	const currentPage = location.href;
	const handleStateChange = useCallback(
		(e) => {
			const isLightboxOpen = !!document.querySelector("#SRLLightbox");

			if (isLightboxOpen) {
				closeLightbox();

				// stay on the current page
				history.pushState(null, null, currentPage);
			}
		},
		[closeLightbox, currentPage]
	);
	useEvent("popstate", handleStateChange);

	return (
		<>
			<Wrap>
				{subFolders.map((dir) => (
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
				{images.map((image, index) => (
					<WrapItem key={image.name + "-" + image.cid.toString()}>
						<ImageCard
							src={`${ipfsPath}/.thumbs/${image.name}`}
							href={`${ipfsPath}/${image.name}`}
							onClick={preventDefault(() => openLightbox(index))}
						/>
					</WrapItem>
				))}
			</Wrap>
			<SRLWrapper
				elements={elements}
				options={{ settings: { slideAnimationType: "both" }, caption: { showCaption: false } }}
			/>
		</>
	);
};
