import Keycloak from 'keycloak-js'

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = new Keycloak({
    url: "http://192.168.219.3:8080/auth/",
    realm: "pass",
    clientId: "react-client",
})

export default keycloak