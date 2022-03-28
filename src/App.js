import React, { Component } from 'react';
import Projects from './components/Project'
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
        <Projects/>
      </ReactKeycloakProvider>
      </div>
    );
}

export default App;