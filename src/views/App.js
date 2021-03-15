import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { IpfsRoute } from '../components/IpfsRoute';
import { FolderView } from './Folder/index.js';
import { HomeView } from './Home';
import { SettingsView } from './Settings';

const App = () => (
  <Switch>
    <Route path="/settings" component={SettingsView} />
    <IpfsRoute path="/folder" component={FolderView} />
    <IpfsRoute path="/" component={HomeView} />
  </Switch>
);

export default App;
