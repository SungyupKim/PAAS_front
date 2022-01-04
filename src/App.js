import { findByTestId } from '@testing-library/react';
import React, {Component} from 'react';
import Contacts from './components/contacts';

class App extends Component {
  state = {
    contacts: []
  }
  componentDidMount() {
    fetch('kubectl-restapi.dev.svc.cluster.local')
    //fetch('http://192.168.219.3/cluster/aaa/namespace/dev')
    .then(res => res.json())
    .then((data) => {
      console.log(data)
      this.setState({ contacts: data.pods})
    })
    .catch(console.log)
  }
  render () {
    return (
      <Contacts contacts={this.state.contacts} />
    );
  }
}

export default App;