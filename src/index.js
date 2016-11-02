import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from './App/App';
import 錄 from './頁/錄';

import Debug from 'debug';
Debug.enable('itaigi:*');

const root = document.getElementById('app');

let history = browserHistory;
render(
  <div>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={錄} />
        <Route path='*' component={錄} />
      </Route>
    </Router>
  </div>,
  root
  );
