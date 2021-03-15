import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";

import App from './views/App';
import { GlobalProviders } from './providers/GlobalProviders';

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

ReactDOM.render(
  <Router>
    <GlobalProviders>
      <App />
    </GlobalProviders>
  </Router>,
  document.getElementById('root')
);
