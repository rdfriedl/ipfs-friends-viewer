import React from "react";
import { useParams } from "react-router-dom";

import { useDeviceInfo } from "../hooks/useDeviceInfo";
import { PageContainer } from "../components/PageContainer";
import { LinkButton } from "../components/LinkButton";

type DeviceViewProps = {
	ipns: string;
};

export const DevicePage = ({ ipns }: DeviceViewProps) => {
	const { data: info, error } = useDeviceInfo(ipns);

	if (error) return <span>{error.message}</span>;
	if (!info) return <h1>Loading</h1>;

	return (
		<>
			<div>{info.name}</div>
			<LinkButton to={ipns + "/files"}>View Files</LinkButton>
		</>
	);
};

type RouteParams = {
	ipns: string;
};

const DeviceView = () => {
	const params = useParams<RouteParams>();

	return (
		<PageContainer>
			<DevicePage ipns={params.ipns} />
		</PageContainer>
	);
};

export default DeviceView;
