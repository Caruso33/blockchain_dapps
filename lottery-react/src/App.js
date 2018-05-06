import React, { Component, Fragment } from 'react';
import './App.css';

import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = { manager: '', players: [], balance: '', value: '', message: '' };

  async componentDidMount() {
    // you don't have to specify the {from: account}-config in call() because
    // you will use the active account from metamask (through the used metamask's provider)
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered!' });
  };

  onClick = async event => {
    event.preventDefault();

    this.setState({ message: 'Waiting on transaction success...' });

    const accounts = await web3.eth.getAccounts();
    await lottery.methods.pickWinner().send({ from: accounts[0] });

    this.setState({ message: 'A winner has been picked!' });
  };

  render() {
    const { manager, players, message, balance } = this.state;
    return (
      <Fragment>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {manager}.
          <br />
          There are currently {players.length} people entered, competing to win{' '}
          {web3.utils.fromWei(balance, 'ether')} ether!
        </p>

        <hr />

        <form onSubmit={this.onSubmit} action="">
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              onChange={event => this.setState({ value: event.target.value })}
              type="text"
            />
            <button>Enter</button>
          </div>
        </form>

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>
        <hr />
        <h1>{message}</h1>
      </Fragment>
    );
  }
}

export default App;
