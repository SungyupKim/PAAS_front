import React from 'react'
import axios from 'axios';
import { useKeycloak } from "@react-keycloak/web";
import resourcesReducer from "./State.js"


const Pods = (namespace) => {
  const podUrl = 'http://192.168.219.3/cluster/abcd/namespace/' + {namespace} + '/pod'

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

  return (
    <div>
    {
      pods.isLoading ? (<p>Loading ... </p>
      ) : (
          <List list={pods.data} />
      )
    }
    </div>
  );
  }

  const List = React.memo(({ list }) =>
    list.map(pod => (
      <Pod
        key={pod.objectID}
        pod={pod}
      />
    ))
  );

  const Pod = ({ pod }) => (
    <div>
      <span>{pod.name} </span>
      <span>{pod.status} </span>
      <span>{pod.age} </span>
      <span>{pod.readyPods} </span>
      <span>{pod.totalPods} </span>
    </div>
  );

  export default Pods;