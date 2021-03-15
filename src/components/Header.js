import React from 'react';

import {Box, Flex, Input, ButtonGroup} from '@chakra-ui/react'
import { LinkButton } from './link-button';

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
