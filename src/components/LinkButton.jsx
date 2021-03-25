import React from 'react';

import {Link} from 'react-router-dom';
import {Button} from "@chakra-ui/react";

export const LinkButton = ({ children, ...props}) => (
	<Button as={Link} {...props}>{children}</Button>
)
