import React from "react";
import { useKeycloak } from "@react-keycloak/web";
import "../App.css"

const Nav = () => {
    const { keycloak, initialized } = useKeycloak();

    return (
        <div>
            <div>
                <section>
                    <nav>
                        <div id="block_container">
                            <h1 className="title">
                                PAAS APPLICATION
                            </h1>
                            <div class="push">
                                <div>
                                    {!keycloak.authenticated && (
                                        <button
                                            type="button"
                                            className="text-blue-800"
                                            onClick={() => keycloak.login()}
                                        >
                                            Login
                                        </button>
                                    )}

                                    {!!keycloak.authenticated && (
                                        <div>
                                        <button
                                            type="button"
                                            className="text-blue-800"
                                            onClick={() => keycloak.logout()}
                                        >
                                            Logout
                                        </button>
                                        <h1 style={{fontSize: '20px'}} className="welcome">hello!! {keycloak.tokenParsed.preferred_username}</h1>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </nav>
                </section>
            </div>
        </div>
    );
};

export default Nav;