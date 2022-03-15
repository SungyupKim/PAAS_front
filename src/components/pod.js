import React from 'react'
import axios from 'axios';
import keycloak from '../keycloak';

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
  const [pods, dispatchPods] = React.useReducer(
    podsReducer, { data: [], isLoading: false, isError: false }
  );

  const handleFetchPods = React.useCallback(async () => {
    dispatchPods({ type: 'PODS_FETCH_INIT' });
    try {
      const result = await axios.get(podUrl, { headers: {"Authorization": 'Bearer ' + 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyQzdtNjdNVDNrLU1ETm1sZld0YWE2NE42VG82azgxcVVlRVI1OXUtUklnIn0.eyJleHAiOjE2NDczNjYyNjksImlhdCI6MTY0NzM2NDQ2OSwianRpIjoiYzNkMGRmY2EtNDBhMS00ZmE5LTgxNTEtMzIyZWRhMjMwNGI4IiwiaXNzIjoiaHR0cDovLzE5Mi4xNjguMjE5LjM6ODA4MC9hdXRoL3JlYWxtcy9wYXNzIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjMyMjM4ZTUzLThkMjgtNDAxYi04YmYxLWNlMjVlYWM3NGE0MiIsInR5cCI6IkJlYXJlciIsImF6cCI6Imt1YmVjdGwtcmVzdGFwaSIsInNlc3Npb25fc3RhdGUiOiI0NmQwNjkyOS05ZTBmLTRjMmMtYTIyMS03N2E5ZTA4ZjdkNTIiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtcGFzcyIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX0sImt1YmVjdGwtcmVzdGFwaSI6eyJyb2xlcyI6WyJwcm9qZWN0QTo6ZGV2ZWxvcGVyIiwidW1hX3Byb3RlY3Rpb24iXX19LCJzY29wZSI6InVtYV9wcm90ZWN0aW9uIGVtYWlsIHByb2ZpbGUiLCJzaWQiOiI0NmQwNjkyOS05ZTBmLTRjMmMtYTIyMS03N2E5ZTA4ZjdkNTIiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImdyb3VwcyI6WyIvZGV2ZWxvcGVyIl0sInByZWZlcnJlZF91c2VybmFtZSI6InN5a2ltIn0.dUEL6edJhEZD8n0LRKfe_4EgawERcceupegqv_V5PZZlGrA36F1CMXhL2DJL1KBlItMjPbeG6YTCHhuDf5ar2BSyXgSFCfZMXfj6iHTh2BCvL4-SbH3AMAmGOiBy2l9-WxcOXZ7cBF2RPEXN7JYAP4wG4FdJnP_1-OJvkI2tOjMB_nzg1G3QLJKpVsO_6y166ke1_GLfI00D8P1eJtNnOHEmiuhSF7qMWcxWfcoQRTvj9_Ffs7nNTh3aPOECgDKfJc3Gcb4nZKx3CzZhs63LpvRjLJ6GSrTxwqGduFQGFdWSnEo-mlJ1tLqTJ2XGDAGsJabmiPwTxQRaRhocbJqrkw'} });

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
  }, [handleFetchPods]);

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