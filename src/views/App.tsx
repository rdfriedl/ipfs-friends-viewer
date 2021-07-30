import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { UnlockView } from "./Unlock";

import { AppSetupRoute } from "../components/AppSetupRoute";
import SetupView from "./Setup";

const Devtools = React.lazy(() => import("../components/Devtools"));
const HomeView = React.lazy(() => import("./Home"));
const SettingsView = React.lazy(() => import("./Settings"));
const DeviceView = React.lazy(() => import("./Device"));
const FolderView = React.lazy(() => import("./Folder"));

const App = () => (
	<Suspense fallback={<h1>Loading View...</h1>}>
		<Switch>
			<AppSetupRoute path="/" component={HomeView} exact />
			<AppSetupRoute path="/device/:ipns" exact component={DeviceView} />
			<AppSetupRoute path="/device/:ipns/files" component={FolderView} />
			<Route path="/settings" component={SettingsView} />
			<Route path="/setup" component={SetupView} />
			<Route path="/unlock" component={UnlockView} />
			<Redirect to="/" />
		</Switch>
		{process.env.NODE_ENV === "development" && <Devtools initialIsOpen={false} />}
	</Suspense>
);

export default App;
