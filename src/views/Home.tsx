import React from "react";

import { useIpfsId } from "../hooks/useIpfsId";
import { PageContainer } from "../components/PageContainer";
import { usePrimaryUser } from "../hooks/usePrimaryUser";
import { useKeys } from "../providers/KeysProvider";
import { LinkButton } from "../components/LinkButton";

const HomePage = () => {
	const { id } = useIpfsId();
	const { privateKey, locked, setup } = useKeys();
	const { data: user } = usePrimaryUser();

	return (
		<>
			<h2>{id ? `IPFS id ${id.id}` : `connecting to ipfs...`}</h2>
			{setup ? (
				<>
					<h3>Email: {user ? user.userID?.email : "Unlock key first"}</h3>
					<h3>ID: {!locked ? privateKey?.getKeyID().toHex() : "Unlock key first"}</h3>
				</>
			) : (
				<LinkButton to="/setup">Setup Key</LinkButton>
			)}
		</>
	);
};

const HomeView = () => (
	<PageContainer>
		<HomePage />
	</PageContainer>
);

export default HomeView;
