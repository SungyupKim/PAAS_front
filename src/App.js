import React, { Component } from 'react';

import Pods from './components/pod';
import keycloak from './keycloak'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import { useKeycloak } from '@react-keycloak/web'
import Nav from "./components/Nav";



const App = () => {

    return (
      <div>
      <ReactKeycloakProvider authClient={keycloak}>
        <Nav />
        <Pods />
        <hr />        
      </ReactKeycloakProvider>
      </div>
    );
}

export default App;