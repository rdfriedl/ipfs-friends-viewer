import React from 'react';
import ReactDOM from 'react-dom';
import { GlobalProviders } from './providers/GlobalProviders.jsx';

import App from './views/App';

ReactDOM.render(
  <GlobalProviders>
    <App />
  </GlobalProviders>,
  document.getElementById('root')
);
