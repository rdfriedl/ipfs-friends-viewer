import React from "react";
import { Box, Grid, Image, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export type FolderCardProps = {
	name: string;
	to: string;
	thumbnails?: string[];
};

export const FolderCard = ({ name, to, thumbnails }: FolderCardProps) => (
	<LinkBox maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
		{thumbnails ? (
			<Grid templateColumns="1fr 1fr" templateRows="1fr 1fr">
				{thumbnails.map((src) => (
					<Image key={src} src={src} />
				))}
			</Grid>
		) : (
			<Image src="https://placehold.co/200x200" />
		)}
		<Box p="4">
			<LinkOverlay as={Link} to={to}>
				{name}
			</LinkOverlay>
		</Box>
	</LinkBox>
);
