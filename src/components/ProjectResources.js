import React, { Component } from 'react'
import axios from 'axios';
import { useKeycloak } from "@react-keycloak/web";
import resourcesReducer from "./State.js"
import '../App.css'
import Namespaces from "./Namespace"
const ProjectResources = ({ projectId }) => {

    const projectResourceUrl = 'http://localhost:1234/project/' + projectId
    /*{'http://192.168.219.3/projects'}*/

    const { keycloak, initialized } = useKeycloak();

    const [projectResources, dispatchProjectsResources] = React.useReducer(
        resourcesReducer, { data: [], isLoading: false, isError: false }
    );

    const handleFetchProjectResources = React.useCallback(async () => {
        dispatchProjectsResources({ type: 'RESOURCES_FETCH_INIT' });
        try {
            const result = await axios.get(projectResourceUrl, { headers: { 'Authorization': 'Bearer ' + keycloak.token } });

            console.log(result.data.projectResources)
            dispatchProjectsResources({
                type: 'RESOURCES_FETCH_SUCCESS',
                payload: result.data.projectResources,
            });
        } catch {
            dispatchProjectsResources({ type: 'RESOURCES_FETCH_FAILURE' });
        }
    }, [projectResourceUrl]);
    React.useEffect(() => {
        handleFetchProjectResources();
    }, [initialized]);

    return (
        <div>
            {
                projectResources.isLoading ? (<p>Loading ... </p>
                ) : (
                    <ClusterList list={projectResources.data} />
                )
            }
        </div>
    );
}

const ClusterList = React.memo(({ list }) =>
    Object.keys(list).map((keyItem) => {
        if (keyItem == 'clusters') {
            return list[keyItem].map((clusterItem) => (
                <ClusterResource cluster={clusterItem} />
            ));
        }
    })
);

class ClusterResource extends Component {
    constructor({ cluster }) {
        super()
        this.cluster = cluster;
        this.state = {
            isClicked: false,
        }
        this._onButtonClick = this._onButtonClick.bind(this);
    }

    _onButtonClick() {
        this.setState({
            isClicked: true,
        });
    }

    render() {
        return this.state.isClicked ? <Namespaces clusterId={this.cluster.clusterId}/> : this.props.isSomethingClicked ? null : <div class="cluster" style={{ width: '100%' }}>
            <span style={{ width: '50%' }}>{this.cluster.name}</span>
            <span>
                <button type="button" onClick={this._onButtonClick}>
                    get namespaces
                </button>
            </span>
        </div>
    }
}

export default ProjectResources;