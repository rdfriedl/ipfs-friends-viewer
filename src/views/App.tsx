import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

// import { IpfsRoute } from "../components/IpfsRoute";
import { SetupRoute } from "../components/SetupRoute";

const Devtools = React.lazy(() => import("../components/Devtools"));
const HomeView = React.lazy(() => import("./Home"));
// const FolderView = React.lazy(() => import("./Folder"));
const SettingsView = React.lazy(() => import("./Settings"));
const SetupView = React.lazy(() => import("./Setup"));
// const ReadonlyGalleryView = React.lazy(() => import("./Readonly"));

const App = () => (
	<Suspense fallback={<h1>Loading View...</h1>}>
		<Switch>
			<SetupRoute path="/" component={HomeView} exact />
			<Route path="/settings" component={SettingsView} />
			<Route path="/setup" component={SetupView} />
			{/* <IpfsRoute path="/folder" component={FolderView} />
			<IpfsRoute path="/ipfs/*" component={ReadonlyGalleryView} />
			<IpfsRoute path="/ipns/*" component={ReadonlyGalleryView} /> */}
			<Redirect to="/" />
		</Switch>
		{process.env.NODE_ENV === "development" && <Devtools initialIsOpen={false} />}
	</Suspense>
);

export default App;
