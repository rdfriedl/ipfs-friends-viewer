import React from "react";
import { useHistory, useParams } from "react-router-dom";

import { Button } from "@chakra-ui/react";
import { PageContainer } from "../components/PageContainer";
import { useQuery } from "react-query";
import { decrypt, readMessage } from "openpgp";
import { useAppSettings } from "../providers/AppSettingsProvider";
import { useKeys } from "../providers/KeysProvider";

type ViewImagePageProps = {
	ipfsHash: string;
};

export const ViewImagePage = ({ ipfsHash }: ViewImagePageProps) => {
	const { gateway } = useAppSettings();
	const { privateKey, publicKey } = useKeys();

	const { data, error } = useQuery<string, Error>(
		["decrypt", ipfsHash],
		async () => {
			const res = await fetch(new URL(`/ipfs/${ipfsHash}`, gateway).href);
			if (!res.body) throw new Error("Failed to fetch image");

			const decrypted = await decrypt({
				message: await readMessage({ binaryMessage: res.body }),
				decryptionKeys: privateKey,
				verificationKeys: publicKey,
				expectSigned: true,
				format: "binary",
			});

			const reader = decrypted.data.getReader() as ReadableStreamDefaultReader<Uint8Array>;
			const arrays: Uint8Array[] = [];
			let done = false;
			while (!done) {
				const result = await reader.read();
				if (result.done) {
					done = true;
					break;
				}
				if (result.value) arrays.push(result.value);
			}
			const merged = new Uint8Array(arrays.reduce((length, arr) => length + arr.length, 0));
			let offset = 0;
			for (const array of arrays) {
				merged.set(array, offset);
				offset += array.length;
			}
			const blob = new Blob([merged], { type: "image/jpeg" });
			return URL.createObjectURL(blob);
		},
		{
			enabled: !!privateKey && !!publicKey && !!gateway,
		}
	);
	const history = useHistory();

	if (error) return <span>{error.message}</span>;
	if (!data) return <h1>Loading</h1>;

	return (
		<>
			<Button onClick={() => history.goBack()}>Back</Button>
			<img src={data} />
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
