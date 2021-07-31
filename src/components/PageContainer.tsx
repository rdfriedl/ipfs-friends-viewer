import React, { Suspense } from "react";
import styled from "styled-components";
import { Header } from "./Header";

export const PageContainer: React.FC = ({ children }) => (
	<>
		<Header />
		<Suspense fallback={<h1>Loading View...</h1>}>{children}</Suspense>
	</>
);
