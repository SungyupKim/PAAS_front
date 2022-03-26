import React, {Component} from 'react'
import axios from 'axios';
import { useKeycloak } from "@react-keycloak/web";
import resourcesReducer from "./State.js"
import '../App.css'
import Services from './Service'
const namespaceUrl = 'http://192.168.219.3/cluster/abcd/namespace'

const Namespaces = () => {
    const { keycloak, initialized } = useKeycloak();

    const [namespaces, dispatchNamespaces] = React.useReducer(
        resourcesReducer, { data: [], isLoading: false, isError: false }
    );

    const handleFetchNamespaces= React.useCallback(async () => {
        dispatchNamespaces({ type: 'RESOURCES_FETCH_INIT' });
        try {
            const result = await axios.get(namespaceUrl, { headers: { 'Authorization': 'Bearer ' + keycloak.token } });

            console.log(result.data.namespaces)
            dispatchNamespaces({
                type: 'RESOURCES_FETCH_SUCCESS',
                payload: result.data.namespaces,
            });

        } catch {
            dispatchNamespaces({ type: 'RESOURCES_FETCH_FAILURE' });
        }
    }, [namespaceUrl]);
    React.useEffect(() => {
        handleFetchNamespaces();
    }, [initialized]);

    return (
        <div>
            {
                namespaces.isLoading ? (<p>Loading ... </p>
                ) : (
                    <List list={namespaces.data} />
                )
            }
        </div>
    );
}

const List = React.memo(({ list }) =>
    list.map(namespace => (
        <Namespace
            key={namespace.objectID}
            namespace={namespace}
        />
    ))
);

class Namespace extends Component{
    constructor({namespace}){
        super()
        this.namespace = namespace
        this.state={
          isClicked: false, 
        }
        this._onButtonClick = this._onButtonClick.bind(this);
    }

    _onButtonClick() {
        this.setState({
            isClicked: true,
        });
    }
    
    render(){
        return <div class="namespace" style={{width:'100%'}}>
        <span style={{width:'50%'}}>{this.namespace}</span>
        <span style={{width:'10%'}}>
            <button type="button" onClick={this._onButtonClick}>
                get services 
            </button>
        </span>
        {this.state.isClicked ? <Services/> : null}
    </div>
    }
}

/*
{
const Namespace = ({ namespace }) => {
    var isClicked = false;

    return <div class="namespace" style={{width:'100%'}}>
        <span style={{width:'50%'}}>{namespace}</span>
        <span style={{width:'10%'}}>
            <button type="button" onClick={() => isClicked = true}>
                get services 
            </button>
        </span>
        {isClicked ? <Services/> : console.log("what?")}
    </div>
};
}
*/
export default Namespaces;