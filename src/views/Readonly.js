import React from 'react';
import Gallery from 'react-grid-gallery';
import { useLocation } from 'react-router-dom';

import { PageContainer } from '../components/PageContainer.js';
import { useFolderImages } from '../hooks/useFolderImages.js';

export const ReadonlyGalleryPage = () => {
	const { pathname } = useLocation();

	const { images } = useFolderImages(pathname);

	return (
		<div>
			{(images && images.length > 0) && (
				<Gallery images={images} enableImageSelection={false}/>
			)}
		</div>
	)
}

export const ReadonlyGalleryView = () => (
	<PageContainer>
		<ReadonlyGalleryPage/>
	</PageContainer>
)
