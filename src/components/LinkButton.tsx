import React from "react";

import { Link, LinkProps } from "react-router-dom";
import { Button } from "@chakra-ui/react";

export type LinkButtonProps = {
	to: LinkProps["to"];
};

export const LinkButton: React.FC<LinkButtonProps> = ({ children, ...props }) => (
	<Button as={Link} {...props}>
		{children}
	</Button>
);
