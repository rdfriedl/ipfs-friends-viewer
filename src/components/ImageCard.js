import React from 'react';
import {Box, Image} from '@chakra-ui/react'
import { Link } from 'react-router-dom';
import { useAppSettings } from '../providers/AppSettingsProvider.js';

export const ImageCard = ({name, src, href}) => {
	const { gateway } = useAppSettings();

	return (
		<Box as="a" maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" href={href}>
			<Image src={src} alt={name}/>
		</Box>
	);
}
