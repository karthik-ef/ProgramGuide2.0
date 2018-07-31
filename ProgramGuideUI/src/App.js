import React, { Component } from 'react';
import './App.css';
import Login from './Components/Login';
import Main from './Components/Dashboard/Dashboard';

class App extends Component {
  constructor() {
    super();
    this.state = {
      flag: false,
      log: []
    }
  }

  handleReq(projects) {
    this.setState({flag: projects})
  }

  render() {

    return (
      <div >
        {/* {this.state.flag ? <Main /> : <Login loginDetails={this.handleReq.bind(this)} />} */}
        <Main/>
      </div>
    );
  }
}

export default App;
