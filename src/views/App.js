import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { IpfsRoute } from '../components/IpfsRoute';
import { FolderView } from './Folder.js';
import { HomeView } from './Home';
import { ReadonlyGalleryView } from './Readonly.js';
import { SettingsView } from './Settings';

const App = () => (
  <Switch>
    <Route path="/settings" component={SettingsView} />
    <IpfsRoute path="/folder" component={FolderView} />
    <IpfsRoute path="/ipfs" component={ReadonlyGalleryView} />
    <IpfsRoute path="/ipns" component={ReadonlyGalleryView} />
    <IpfsRoute path="/" component={HomeView} />
  </Switch>
);

export default App;
