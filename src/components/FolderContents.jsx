import React, { useMemo, useState } from "react";
import { SRLWrapper } from "simple-react-lightbox";

import { Wrap, WrapItem } from '@chakra-ui/react';

import { useIpfsFolder } from '../hooks/useIpfsFileFolder';
import { useAppSettings } from '../providers/AppSettingsProvider';
import { ImageCard } from './ImageCard';
import { FolderCard } from './FolderCard';
import { imageTypes } from '../const';

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
      </Wrap>
      <Wrap
        as={SRLWrapper}
        options={{ settings: {slideAnimationType: "both"}, caption: { showCaption: false} }}
      >
        {images.map((image, index) => (
          <WrapItem key={image.cid.toString()}>
            <ImageCard
              name={image.name}
              src={`${ipfsPath}/.thumbs/${image.name}`}
              href={`${ipfsPath}/${image.name}`}
            />
          </WrapItem>
        ))}
      </Wrap>
    </>
  );
}
