import React from 'react';
import { Box, Grid, Image } from '@chakra-ui/react'
import { Link } from 'react-router-dom';

export const FolderCard = ({name, to, thumbnails}) => (
	<Box as={Link} maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" to={to}>
		{thumbnails ? (
			<Grid templateColumns="1fr 1fr" templateRows="1fr 1fr">
				{thumbnails.map(src => (
					<Image key={src} src={src}/>
				))}
			</Grid>
		) : (
			<Image src="https://placehold.co/256x256"/>
		)}
		<Box p="4">
			<Box
				mt="1"
				fontWeight="semibold"
				as="h4"
				isTruncated
			>
				{name}
			</Box>
		</Box>
	</Box>
);
