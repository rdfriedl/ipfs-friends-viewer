import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { IpfsRoute } from '../components/IpfsRoute';
import { FolderView } from './Folder.js';
import { HomeView } from './Home';
import { ReadonlyGalleryView } from './Readonly.js';
import { SettingsView } from './Settings';
import { ReactQueryDevtools } from 'react-query/devtools'

const App = () => (
  <>
    <Switch>
      <IpfsRoute path="/" component={HomeView} exact />
      <Route path="/settings" component={SettingsView} />
      <IpfsRoute path="/folder" component={FolderView} />
      <IpfsRoute path="/ipfs/*" component={ReadonlyGalleryView} />
      <IpfsRoute path="/ipns/*" component={ReadonlyGalleryView} />
      <Redirect to="/"/>
    </Switch>
    <ReactQueryDevtools initialIsOpen={false} />
  </>
);

export default App;
