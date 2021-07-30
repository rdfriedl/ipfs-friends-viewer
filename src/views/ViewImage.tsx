import React from "react";
import { useHistory, useParams } from "react-router-dom";

import { Button } from "@chakra-ui/react";
import { PageContainer } from "../components/PageContainer";
import { useDecryptedFile } from "../hooks/useDecryptedFile";
import { useObjectUrl } from "../hooks/useObjectUrl";

type ViewImagePageProps = {
	ipfsHash: string;
};

export const ViewImagePage = ({ ipfsHash }: ViewImagePageProps) => {
	const { data, error } = useDecryptedFile(ipfsHash, 'image/jpeg');
	const history = useHistory();

	const src = useObjectUrl(data);

	if (error) return <span>{error.message}</span>;
	if (!data) return <h1>Loading</h1>;

	return (
		<>
			<Button onClick={() => history.goBack()}>Back</Button>
			<img src={src} />
		</>
	);
};

type RouteParams = {
	ipfsHash: string;
};

const ViewImageView = () => {
	const params = useParams<RouteParams>();

	return (
		<PageContainer>
			<ViewImagePage ipfsHash={params.ipfsHash} />
		</PageContainer>
	);
};

export default ViewImageView;
