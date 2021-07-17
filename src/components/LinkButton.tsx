import React from "react";

import { Link, LinkProps } from "react-router-dom";
import { Button, ButtonProps } from "@chakra-ui/react";

export type LinkButtonProps = ButtonProps & {
	to: LinkProps["to"];
};

export const LinkButton: React.FC<LinkButtonProps> = ({ children, ...props }) => (
	<Button as={Link} {...props}>
		{children}
	</Button>
);
