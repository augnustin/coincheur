import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import SocketManager from './components/SocketManager';
import { Provider } from 'react-redux';
import store from './redux/store';

import LandingPage from './pages/LandingPage';
import GamePage from './pages/GamePage';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Route exact path="/" component={LandingPage} />
      <SocketManager>
        <Route exact path="/game/:tableId" component={GamePage} />
      </SocketManager>
    </BrowserRouter>
  </Provider>,
  document.getElementById('container')
);