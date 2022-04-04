import React, {Component} from 'react'
import axios from 'axios';
import { useKeycloak } from "@react-keycloak/web";
import resourcesReducer, {clickReducer} from "./State.js"


const Pods = ({cluster, namespace}) => {
  const podUrl = 'http://localhost:1234/cluster/' + cluster +'/namespace/' + namespace + '/pod'

  const { keycloak, initialized } = useKeycloak();

  const [pods, dispatchPods] = React.useReducer(
    resourcesReducer, { data: [], isLoading: false, isError: false }
  );

  const handleFetchPods = React.useCallback(async () => {
    dispatchPods({ type: 'RESOURCES_FETCH_INIT' });
    try {
      const result = await axios.get(podUrl, { headers: { 'Authorization': 'Bearer ' + keycloak.token } });

      console.log(result.data.pods)
      dispatchPods({
        type: 'RESOURCES_FETCH_SUCCESS',
        payload: result.data.pods,
      });

    } catch {
      dispatchPods({ type: 'RESOURCES_FETCH_FAILURE' });
    }
  }, [podUrl]);
  React.useEffect(() => {
    handleFetchPods();
  }, [initialized]);

  const [podResource, dispatchClickResources] = React.useReducer(
    clickReducer, { isInit: true, isClicked: false }
  );

  return (
    <div>
    {
      pods.isLoading ? (<p>Loading ... </p>
      ) : (
          <List list={pods.data} dispatcher={dispatchClickResources} clicked={podResource.isClicked}/>
      )
    }
    </div>
  );
  }

  const List = React.memo(({ list, dispatcher, clicked}) =>
    list.map(pod => (
      <Pod
        key={pod.objectID}
        pod={pod}
        clickCallback={dispatcher}
        isSomethingClicked={clicked}
      />
    ))
  );

  class Pod extends Component {
    constructor({ pod, clickCallback}) {
        super()
        this.pod = pod
        this.onClick = clickCallback
        this.state = {
            isClicked: false,
        }
        this._onButtonClick = this._onButtonClick.bind(this);
    }

    _onButtonClick() {
        this.onClick({ type: 'RESOURCES_CLICKED' });
        console.log('click!!!')
        this.setState({
            isClicked: true,
        });
    }

    render() {
        return this.state.isClicked ? null : this.props.isSomethingClicked ? null :  <div class='pod' style={{ width: '100%' }} >
        <span style={{ width: '50%' }}>{this.pod.name} </span>
        <span style={{ width: '10%' }}>{this.pod.status} </span>
        <span style={{ width: '10%' }}>{this.pod.age} </span>
        <span style={{ width: '10%' }}>{this.pod.readyPods} </span>
        <span style={{ width: '10%' }}>{this.pod.totalPods} </span>
      </div>
    }
}

  export default Pods;