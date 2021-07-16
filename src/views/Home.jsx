import React from "react";

import { useIpfsId } from "../hooks/useIpfsId";
import { PageContainer } from "../components/PageContainer";

const HomePage = () => {
	const { id } = useIpfsId();

	return <h2>{id ? `IPFS id ${id.id}` : `connecting to ipfs...`}</h2>;
};

const HomeView = () => (
	<PageContainer>
		<HomePage />
	</PageContainer>
);

export default HomeView;
