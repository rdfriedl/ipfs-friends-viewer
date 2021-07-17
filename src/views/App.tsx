import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

// import { IpfsRoute } from "../components/IpfsRoute";

const Devtools = React.lazy(() => import("../components/Devtools"));
const HomeView = React.lazy(() => import("./Home"));
const SettingsView = React.lazy(() => import("./Settings"));
const SetupView = React.lazy(() => import("./Setup"));

const App = () => (
	<Suspense fallback={<h1>Loading View...</h1>}>
		<Switch>
			<Route path="/" component={HomeView} exact />
			<Route path="/settings" component={SettingsView} />
			<Route path="/setup" component={SetupView} />
			<Redirect to="/" />
		</Switch>
		{process.env.NODE_ENV === "development" && <Devtools initialIsOpen={false} />}
	</Suspense>
);

export default App;
