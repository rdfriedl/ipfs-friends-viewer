import React from 'react';
import {Box, Image} from '@chakra-ui/react'

export const ImageCard = ({name, src, href}) => (
	<Box as="a" maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" href={href} target="_blank">
		<Image src={src} alt={name}/>
	</Box>
);
