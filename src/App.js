import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import IdeoCoinContract from '../build/contracts/IdeoCoin.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      input: ''
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      // this.instantiateContract()
      this.getContracts()
      // this.sendIdeoCoin()
      // this.mintCoinsToAccount()
      this.getIdeoCoinBalance()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  mintCoinsToAccount() {
    const contract = require('truffle-contract')
    const IdeoCoin = contract(IdeoCoinContract)
    IdeoCoin.setProvider(this.state.web3.currentProvider)

    var account = 2; // an address

    var meta;
      IdeoCoin.deployed().then(function(instance) {
        meta = instance;
        return meta.mintToken(account, 1000000);
      }).then(function(result) {
        // If this callback is called, the transaction was successfully processed.
        alert("Transaction successful!")
      }).catch(function(e) {
        console.log(e);
        // There was an error! Handle it.
      })
  }


  sendIdeoCoin() {
    const contract = require('truffle-contract')
    const IdeoCoin = contract(IdeoCoinContract)
    IdeoCoin.setProvider(this.state.web3.currentProvider)

    var account_one = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"; // an address
    var account_two = '0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e'; // another address

    var meta;
      IdeoCoin.deployed().then(function(instance) {
        meta = instance;
        return meta.sendCoin(account_two, 1000000, {from: account_one});
      }).then(function(result) {
        // If this callback is called, the transaction was successfully processed.
        alert("Transaction successful!")
      }).catch(function(e) {
        console.log(e);
        // There was an error! Handle it.
      })

  }

  getIdeoCoinBalance() {
    const contract = require('truffle-contract')
    const IdeoCoin = contract(IdeoCoinContract)
    IdeoCoin.setProvider(this.state.web3.currentProvider)
    // IdeoCoin.deployed().then(function(instance) {
    //   console.log(instance);
    // });

    var account_one = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57'; // an address
    var meta;


    IdeoCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account_one, {from: account_one});
    }).then(function(balance) {
      // If this callback is called, the call was successfully executed.
      // Note that this returns immediately without any waiting.
      // Let's print the return value.
      console.log(balance.toNumber());
    }).catch(function(e) {
      console.log(e);
      // There was an error! Handle it.
    })

  }

  getContracts() {
    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance

        return simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
      })
    })
  }

  instantiateContract(number) {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance

        // Stores a given value, 5 by default.
        return simpleStorageInstance.set(number, {from: accounts[0]})
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
      })
    })
  }

  handleChange = (event) => {
    this.setState({
      input: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.instantiateContract(this.state.input)
  }

  render() {
    let resp
    if (this.state.storageValue < 20) {
      resp = "contract valid"
    } else {
      resp = "failed contract"
    }
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            {/* <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a> */}
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              {/* <h1>Good to Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <h2>Smart Contract Example</h2>
              <p>If your contracts compiled and migrated successfully, below will show a stored value of 5 (by default).</p>
              <p>Try changing the value stored on <strong>line 59</strong> of App.js.</p>
              <p>The stored value is: {this.state.storageValue}</p> */}
              <h1>{resp}</h1>
            </div>
            <form onSubmit={this.handleSubmit}>
              <input type="number" onChange={this.handleChange} value={this.state.input}></input>
              <input type="submit"></input>
            </form>
          </div>
        </main>
      </div>
    );
  }
}

export default App
