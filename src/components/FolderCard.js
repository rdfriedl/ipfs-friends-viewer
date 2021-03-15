import React from 'react';
import {Box, Image} from '@chakra-ui/react'
import { Link } from 'react-router-dom';

export const FolderCard = ({name, cid, to}) => (
	<Box as={Link} maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" to={to}>
		<Image src="https://placehold.co/256x256"/>
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
