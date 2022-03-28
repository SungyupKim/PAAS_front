import React from 'react'
import axios from 'axios';
import { useKeycloak } from "@react-keycloak/web";
import resourcesReducer from "./State.js"
import '../App.css'

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

    return (
        <div>
            {
                services.isLoading ? (<p>Loading ... </p>
                ) : (
                    <List list={services.data} />
                )
            }
        </div>
    );
}

const List = React.memo(({ list }) =>
    list.map(service => (
        <Service
            key={service.objectID}
            service={service}
        />
    ))
);

const Service = ({ service }) => (
    <div class = "Service" style={{width:'100%'}}>
        <span style={{width:'30%'}}>{service.name} </span>
        <span style={{width:'20%'}}>{service.labelSelector} </span>
        <span style={{width:'20%'}}>{service.age} </span>
        <span style={{width:'20%'}}>{service.clusterIp} </span>
        <span style={{width:'10%'}}>
            <button type="button">
                get pods
            </button>
        </span>
    </div>
);

export default Services;