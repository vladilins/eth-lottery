import "./App.css";
import React from "react";
import web3 from "./web3";

class App extends React.Component {
  render() {
    web3.eth.getAccounts().then(console.log);
    return <div>test</div>;
  }
}
export default App;
