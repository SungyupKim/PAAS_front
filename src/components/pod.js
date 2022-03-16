import React from 'react'
import axios from 'axios';
import keycloak from '../keycloak';
import { useKeycloak } from "@react-keycloak/web";

const podUrl = 'http://localhost:1234/cluster/abcd/namespace/dev/pod'
const podsReducer = (state, action) => {
  switch (action.type) {
    case 'PODS_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'PODS_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'PODS_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const Pods = () => {
  const { keycloak, initialized } = useKeycloak();

  const [pods, dispatchPods] = React.useReducer(
    podsReducer, { data: [], isLoading: false, isError: false }
  );

  const handleFetchPods = React.useCallback(async () => {
    dispatchPods({ type: 'PODS_FETCH_INIT' });
    try {
      const result = await axios.get(podUrl, { headers: {'Authorization': 'Bearer '  + keycloak.token}});

      console.log(result.data.pods)
      dispatchPods({
        type: 'PODS_FETCH_SUCCESS',
        payload: result.data.pods,
      });

    } catch {
        dispatchPods({ type: 'PODS_FETCH_FAILURE' });
    }
  }, [podUrl]);
  React.useEffect(() => {
    handleFetchPods();
  }, [initialized]);

  return (
    <div>
       <List list={pods.data}/>
    </div>
  )
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
      <span style={{ width: '40%' }}>{pod.name}</span>
      <span style={{ width: '30%' }}>{pod.status}</span>
      <span style={{ width: '10%' }}>{pod.age}</span>
      <span style={{ width: '10%' }}>{pod.readyPods}</span>
      <span style={{ width: '10%' }}>{pod.totalPods}</span>
    </div>
  );

export default Pods;