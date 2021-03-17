import React from 'react';

import {Box, Flex, ButtonGroup} from '@chakra-ui/react'
import { LinkButton } from './LinkButton';

export const Header = () => (
	<Box as="nav" w="100%" padding="2">
		<Flex justifyContent="space-between">
			<ButtonGroup>
				<LinkButton to="/">Home</LinkButton>
				<LinkButton to="/folder">Browse</LinkButton>
				<LinkButton to="/settings">Settings</LinkButton>
			</ButtonGroup>
		</Flex>
	</Box>
)
