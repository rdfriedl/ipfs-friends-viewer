import React from 'react';
import ReactDOM from 'react-dom';

import App from './views/App';
import { GlobalProviders } from './providers/GlobalProviders';

ReactDOM.render(
  <GlobalProviders>
    <App />
  </GlobalProviders>,
  document.getElementById('root')
);
