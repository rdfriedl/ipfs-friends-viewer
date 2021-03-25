import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ReactQueryDevtools } from "react-query/es/devtools";
import SimpleReactLightbox from "simple-react-lightbox";

import { IpfsRoute } from '../components/IpfsRoute';
import { GlobalProviders } from '../providers/GlobalProviders.jsx';

const HomeView = React.lazy(() => import('./Home.jsx'));
const FolderView = React.lazy(() => import('./Folder.jsx'));
const SettingsView = React.lazy(() => import('./Settings.jsx'));
const ReadonlyGalleryView = React.lazy(() => import('./Readonly.jsx'));

const App = () => (
  <GlobalProviders>
    <SimpleReactLightbox>
      <Suspense fallback={<h1>Loading View...</h1>}>
        <Switch>
          <IpfsRoute path="/" component={HomeView} exact />
          <Route path="/settings" component={SettingsView} />
          <IpfsRoute path="/folder" component={FolderView} />
          <IpfsRoute path="/ipfs/*" component={ReadonlyGalleryView} />
          <IpfsRoute path="/ipns/*" component={ReadonlyGalleryView} />
          <Redirect to="/" />
        </Switch>
      </Suspense>
      <ReactQueryDevtools initialIsOpen={false} />
    </SimpleReactLightbox>
  </GlobalProviders>
);

export default App;
