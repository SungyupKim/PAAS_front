import React, {Component} from 'react'
import axios from 'axios';
import { useKeycloak } from "@react-keycloak/web";
import resourcesReducer, {clickReducer} from "./State.js"
import '../App.css'
import Pods from "./pod.js"

const Services = ({clusterId, namespace}) => {
    const serviceUrl = 'http://localhost:1234/cluster/' + clusterId + '/namespace/' + namespace + '/service'

    const { keycloak, initialized } = useKeycloak();

    const [services, dispatchServices] = React.useReducer(
        resourcesReducer, { data: [], isLoading: false, isError: false }
    );

    const handleFetchServices = React.useCallback(async () => {
        dispatchServices({ type: 'RESOURCES_FETCH_INIT' });
        try {
            const result = await axios.get(serviceUrl, { headers: { 'Authorization': 'Bearer ' + keycloak.token } });

            console.log(result.data.services)
            dispatchServices({
                type: 'RESOURCES_FETCH_SUCCESS',
                payload: result.data.services,
            });

        } catch {
            dispatchServices({ type: 'RESOURCES_FETCH_FAILURE' });
        }
    }, [serviceUrl]);
    React.useEffect(() => {
        handleFetchServices();
    }, [initialized]);

    const [serviceResource, dispatchClickResources] = React.useReducer(
        clickReducer, { isInit: true, isClicked: false }
    );

    return (
        <div>
            {
                services.isLoading ? (<p>Loading ... </p>
                ) : (
                    <List list={services.data} isClicked={serviceResource.isClicked} dispatcher={dispatchClickResources} namespace={namespace} clusterId={clusterId}/>
                )
            }
        </div>
    );
}

const List = React.memo(({ list, isClicked, dispatcher, namespace, clusterId }) =>
    list.map(service => (
        <ServiceResource
            key={service.objectID}
            service={service}
            isSomethingClicked={isClicked}
            dispatcher={dispatcher}
            namespace={namespace}
            clusterId={clusterId}
        />
    ))
);

class ServiceResource extends Component {
    constructor({ service, dispatcher }) {
        super()
        this.service = service;
        this.state = {
            isClicked: false,
        }
        this.onClick = dispatcher
        this._onButtonClick = this._onButtonClick.bind(this);
    }

    _onButtonClick() {
        this.onClick({ type: 'RESOURCES_CLICKED' });
        this.setState({
            isClicked: true,
        });
    }

    render() {
        return this.state.isClicked ? <Pods cluster={this.props.clusterId} namespace={this.props.namespace}/> : this.props.isSomethingClicked ? null : <div class = "service" style={{width:'100%'}}>
        <span style={{width:'30%'}}>{this.service.name} </span>
        <span style={{width:'20%'}}>{this.service.labelSelector} </span>
        <span style={{width:'20%'}}>{this.service.age} </span>
        <span style={{width:'20%'}}>{this.service.clusterIp} </span>
        <span style={{width:'10%'}}>
            <button type="button" onClick={this._onButtonClick}>
                get pods
            </button>
        </span>
    </div>
    }
}

export default Services;