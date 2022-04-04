import React, { Component } from 'react'
import axios from 'axios';
import { useKeycloak } from "@react-keycloak/web";
import resourcesReducer, {clickReducer} from "./State.js"
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


    const [projectResource, dispatchClickResources] = React.useReducer(
        clickReducer, { isInit: true, isClicked: false }
    );

    return (
        <div>
            {
                projectResources.isLoading ? (<p>Loading ... </p>
                ) : (
                    <ClusterList list={projectResources.data} clicked={projectResource.isClicked} dispatcher={dispatchClickResources}/>
                )
            }
        </div>
    );
}

const ClusterList = React.memo(({ list, clicked, dispatcher }) =>
    Object.keys(list).map((keyItem) => {
        if (keyItem == 'clusters') {
            return list[keyItem].map((clusterItem) => (
                <ClusterResource cluster={clusterItem} isSomethingClicked={clicked} dispatcher={dispatcher}/>
            ));
        }
    })
);

class ClusterResource extends Component {
    constructor({ cluster, dispatcher}) {
        super()
        this.cluster = cluster;
        this.onClick = dispatcher;
        this.state = {
            isClicked: false,
        }
        this._onButtonClick = this._onButtonClick.bind(this);
    }

    _onButtonClick() {
        this.onClick({ type: 'RESOURCES_CLICKED' });
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