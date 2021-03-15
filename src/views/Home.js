import React from 'react';

import { useIpfsId } from '../hooks/use-ipfs-id';
import { PageContainer } from '../components/PageContainer.js';

export const HomeView = () => {
	const {id} = useIpfsId();

	return (
		<PageContainer>
			<h2>{id ? `IPFS id ${id.id}` : `connecting to ipfs...`}</h2>
		</PageContainer>
	)
}
