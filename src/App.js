import React from 'react';
import { withRouter } from 'react-router-dom';
import AccountContextProvider from './context/AccountContext';
import Router from './components/Router';

function App() {
  return (
    <div className="App">
      <AccountContextProvider>
        <Router />
      </AccountContextProvider>
    </div>
  );
}

export default withRouter(App);
