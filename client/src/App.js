import React, { useState, useEffect } from "react";
import "./App.css";
import web3 from "./web3";
import lotteryInstance from "./lottery";

function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function asyncCalls() {
      await lotteryInstance.methods
        .manager()
        .call()
        .then((result) => setManager(result));
      await lotteryInstance.methods
        .getPlayers()
        .call()
        .then((result) => setPlayers(result));
      await web3.eth
        .getBalance(lotteryInstance.options.address)
        .then((result) => setBalance(result));
    }

    asyncCalls();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setMessage("Waiting for the transaction to be mined...");
    await lotteryInstance.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("1", "ether"),
    });
    setMessage("You have been entered into the lottery! Good luck!!");
  };

  const pickWinner = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setMessage("Waiting for the transaction to be mined...");
    await lotteryInstance.methods.pickWinner().send({ from: accounts[0] });
    setMessage("A winner has been picked!");
  };

  const isManager = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    return accounts[0] === manager;
  };

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {manager}. There are currently{" "}
        {players.length} people in the pool, competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether!
      </p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Each lottery ticket costs exactly 1 Ether.</label>
        </div>
        <button>Enter</button>
      </form>
      {isManager && (
        <>
          <hr />
          <h4>Ready to pick a winner?</h4>
          <button onClick={pickWinner}>Pick a winner!</button>
        </>
      )}
      <hr />
      <h2>{message}</h2>
    </div>
  );
}

export default App;
