import React from "react";

import { useIpfsId } from "../hooks/useIpfsId";
import { PageContainer } from "../components/PageContainer";
import { usePrimaryUser } from "../hooks/usePrimaryUser";
import { useKeys } from "../providers/KeysProvider";

const HomePage = () => {
	const { id } = useIpfsId();
	const {privateKey, locked} = useKeys();
	const {data: user} = usePrimaryUser();

	return <>
		<h2>{id ? `IPFS id ${id.id}` : `connecting to ipfs...`}</h2>
		<h3>Email: {user ? user.userID?.email : 'Unlock key first'}</h3>
		<h3>ID: {!locked ? privateKey?.getKeyID().toHex() : 'Unlock key first'}</h3>
	</>
};

const HomeView = () => (
	<PageContainer>
		<HomePage />
	</PageContainer>
);

export default HomeView;
