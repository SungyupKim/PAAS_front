import React, { Component } from 'react';

import Pods from './components/pod';
import Services from './components/Service'
import Namespaces from './components/Namespace'
import keycloak from './keycloak'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import Nav from "./components/Nav";
import "./App.css"

const App = () => {

    return (
      <div>
      <ReactKeycloakProvider authClient={keycloak}>
        <Nav />
        <hr />       
        <Namespaces/>
      </ReactKeycloakProvider>
      </div>
    );
}

export default App;