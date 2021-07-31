import React from "react";
import { Code, Tooltip } from "@chakra-ui/react";

export type CopyableTextProps = {
	children: string;
};

export const CopyableText = ({ children }: CopyableTextProps) => (
	<Tooltip label="Copy to clipboard" aria-label="A tooltip">
		<Code cursor="pointer" px="2" py="1" onClick={() => navigator.clipboard.writeText(children)}>
			{children}
		</Code>
	</Tooltip>
);
