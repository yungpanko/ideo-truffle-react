import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import IdeoCoinContract from '../build/contracts/IdeoCoin.json'
import getWeb3 from './utils/getWeb3'
import Balances from './components/Balances.js'
import ReactCountdownClock from 'react-countdown-clock'

// import './css/oswald.css'
// import './css/open-sans.css'
// import './css/pure-min.css'
import './css/bootstrap.min.css'
import './App.css'

// Create our number formatter.
const formatter = new Intl.NumberFormat('en-US', {
style: 'currency',
currency: 'USD',
minimumFractionDigits: 0,
// the default value for minimumFractionDigits depends on the currency
// and is usually already 2
})

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      input: '',
      fromValue: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
      toValue: '0xf17f52151EbEF6C7334FAD080c5704D77216b732',
      amount: '',
      penaltyAmount: '',
      accountOneBalance: 0,
      accountTwoBalance: 0,
      contract: '',
      results: '',
      penatly: ''
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
      // this.getIdeoCoinBalance()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }


  componentDidMount() {
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      this.getCoinOwnerBalance()
      this.getIndexOneBalance()
      // this.getIdeoCoinBalance()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
    // setInterval(() => {
    //   // this.checkAccelerometerX()
    //   this.checkAccelerometerY()
    // }, 1500);
  }

  mintCoinsToAccount() {
    const contract = require('truffle-contract')
    const IdeoCoin = contract(IdeoCoinContract)
    IdeoCoin.setProvider(this.state.web3.currentProvider)

    var account_one = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"; // an address

    var meta;
      IdeoCoin.deployed().then(function(instance) {
        meta = instance;
        return meta.mintToken(account_one, 1000000);
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
        console.log("Transaction successful!")
      }).catch(function(e) {
        console.log(e);
        // There was an error! Handle it.
      })

  }

  executeFormTransaction(from, to, amount) {
    const contract = require('truffle-contract')
    const IdeoCoin = contract(IdeoCoinContract)
    IdeoCoin.setProvider(this.state.web3.currentProvider)

    var meta;
    IdeoCoin.deployed().then(instance => {
      meta = instance;
      return meta.sendCoin(to, amount, {from: from});
    }).then(result => {
      // If this callback is called, the transaction was successfully processed.
      console.log("Transaction successful!")
      this.getCoinOwnerBalance()
      this.getIndexOneBalance()
    }).catch(err => {
      console.log(err);
      // There was an error! Handle it.
    })
  }

  getCoinOwnerBalance() {
    const contract = require('truffle-contract')
    const IdeoCoin = contract(IdeoCoinContract)
    IdeoCoin.setProvider(this.state.web3.currentProvider)
    // IdeoCoin.deployed().then(function(instance) {
    //   console.log(instance);
    // });

    var account_one = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57'; // an address
    var meta;


    IdeoCoin.deployed().then(instance => {
      meta = instance;
      return meta.getBalance.call(account_one, {from: account_one});
    }).then(balance => {
      // If this callback is called, the call was successfully executed.
      // Note that this returns immediately without any waiting.
      // Let's print the return value.
      console.log(balance.toNumber());
      this.setState({
        accountOneBalance: balance.toNumber()
      })
    }).catch(err => {
      console.log(err);
      // There was an error! Handle it.
    })
  }

  getIndexOneBalance() {
    const contract = require('truffle-contract')
    const IdeoCoin = contract(IdeoCoinContract)
    IdeoCoin.setProvider(this.state.web3.currentProvider)
    // IdeoCoin.deployed().then(function(instance) {
    //   console.log(instance);
    // });

    var account_one = '0xf17f52151EbEF6C7334FAD080c5704D77216b732'; // an address
    var meta;


    IdeoCoin.deployed().then(instance => {
      meta = instance;
      return meta.getBalance.call(account_one, {from: account_one});
    }).then(balance => {
      // If this callback is called, the call was successfully executed.
      // Note that this returns immediately without any waiting.
      // Let's print the return value.
      console.log(balance.toNumber());
      this.setState({
        accountTwoBalance: balance.toNumber()
      })
    }).catch(err => {
      console.log(err);
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

  handleFromValueChange = (event) => {
    this.setState({
      fromValue: event.target.value
    })
  }

  handleTransactionSubmit = (event) => {
    event.preventDefault()
    this.executeFormTransaction(this.state.fromValue, this.state.toValue, this.state.amount)
    this.getCoinOwnerBalance()
    this.getIndexOneBalance()
  }

  handleCountdownComplete = (event) => {
    if (this.state.penatly) {
      this.executeFormTransaction(this.state.fromValue, this.state.toValue, this.state.amount + this.state.penaltyAmount)
      this.setState({
        results: formatter.format(this.state.amount + this.state.penaltyAmount)
      })
    } else {
      this.executeFormTransaction(this.state.fromValue, this.state.toValue, this.state.amount)
      this.setState({
        results: formatter.format(this.state.amount)
      })
    }
  }

  handleToValueChange = (event) => {
    this.setState({
      toValue: event.target.value
    })
  }

  handleAmountChange = (event) => {
    this.setState({
      amount: parseInt(event.target.value,10)
    })
  }

  handlePenaltyAmountChange = (event) => {
    this.setState({
      penaltyAmount: parseInt(event.target.value,10)
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.instantiateContract(this.state.input)
  }

  handleNewContract = (event) => {
    this.setState({
      contract: "yes"
    })
    setInterval(() => {
      // this.checkAccelerometerX()
      this.checkAccelerometerY()
    }, 1000);
  }

  handleStartOver = (event) => {
    this.setState({
      contract: '',
      results: '',
      penaltyAmount: '',
      amount: '',
      penatly:''
    })
  }

  handleCrash = (event) => {
    this.setState({
      penatly: 'yes'
    })
  }

  checkAccelerometerX() {
    fetch('https://io.adafruit.com/api/v2/gpangaro/feeds/xvalue/data/last')
    .then(res => res.json())
    .then(res => console.log("x: " + res.value))
    .catch(error => console.error('Error:', error))
  }

  checkAccelerometerY() {
    fetch('https://io.adafruit.com/api/v2/gpangaro/feeds/yvalue/data/last')
    .then(res => res.json())
    .then(res => {
      console.log("y: " + res.value)
      if (res.value > 0) {
        this.setState({
          penatly: "yes"
        })
      }}
    )
    .catch(error => console.error('Error:', error))
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <nav className="header" id="banner">
              <div className="container-fluid">
                <div className="padleft10px">
                  { this.state.contract ?
                    <button className="pull-left backButton" onClick={this.handleStartOver}>
                      Start Over
                    </button>  :
                    <div></div>
                  }
                  {/* <button type="button" className="pull-left backButton">
                    <span className="glyphicon glyphicon-chevron-left" ></span>Back
                  </button> */}
                  <div>
                    <h3>Sweet Ride</h3>
                  </div>
                </div>
              </div>
            </nav>


            <div >

              <div >


              { this.state.results ? <div className="col-md-12 text-center"><h1>Final Tally: {this.state.results}</h1></div> : <div></div> }
              { this.state.contract ?
                <div className="row">
                  <div className="col-md-12 text-center">

              <ReactCountdownClock seconds={5}
                     color="#34ed99"
                     alpha={0.9}
                     size={400}
                     onComplete={this.handleCountdownComplete}/>
                   </div>
                   </div> :
                     <div>
                     <div className="row">
                         <div className="col-md-12 text-center">
                          <img src="img/car.png" alt="car"/>
                         </div>
                     </div>

                     <br/><br/>
                      <div className="row paddpanel">
                       <div className="col-md-12 col-sm-12 col-xs-12">
                           <h3>Welcome to Sweet Ride Smart Contract Page</h3>
                         </div>
                       </div>

                       <br/><br/>
                     <form onSubmit={this.handleTransactionSubmit}>
                     <div className="row paddpanel">
                       <div className="col-md-5 col-sm-5 col-xs-5">
                        <label className="labelStyle">Renter &nbsp;</label><br/>
                         <select className="form-control" id="renter" value={this.state.fromValue} onChange={this.handleFromValueChange}>
                           <option value="0x627306090abaB3A6e1400e9345bC60c78a8BEf57">Amy</option>
                           <option value="0xf17f52151EbEF6C7334FAD080c5704D77216b732">Theo</option>
                         </select>
                       </div>
                         <div className="col-md-5 col-sm-5 col-xs-5 text-left">
                         <label className="labelStyle">Car Owner</label>
                         <select className="form-control" id="owner" value={this.state.toValue} onChange={this.handleToValueChange}>
                           <option value="0xf17f52151EbEF6C7334FAD080c5704D77216b732">Theo</option>
                           <option value="0x627306090abaB3A6e1400e9345bC60c78a8BEf57">Amy</option>
                         </select>
                       </div>
                     </div>
                       <div className="row paddpanel">
                         <div className="col-md-5 col-sm-5 col-xs-5">
                               <div className="form-group">
                                 <label className="labelStyle">Rental Price</label>
                                 <input className="form-control" id="exampleInputEmail2" type='number' onChange={this.handleAmountChange} value={this.state.amount}>
                                </input>
                              </div>
                            </div>
                          <div className="col-md-5 col-sm-5 col-xs-5 text-left">
                                <div className="form-group">
                                  <label className="labelStyle">Penalty Price</label>
                                  <input className="form-control" id="exampleInputPassword2" type='number' onChange={this.handlePenaltyAmountChange} value={this.state.penaltyAmount}>
                                  </input>
                                </div>
                              </div>
                       </div>
                       </form>
                       <div className="row paddpanel">
                         <div className="col-md-12 col-sm-12 col-xs-12">
                       <button className="btn btn-block  buttonContinue" onClick={this.handleNewContract}>
                         New Contract
                       </button>
                       </div>
                       </div>
                       </div>
                     }
                     <div className="row paddpanel">
                         <div className="col-md-12 col-sm-12 col-xs-12">
                             <ul>
                               <Balances balance1={this.state.accountOneBalance} balance2={this.state.accountTwoBalance}/>
                             </ul>
                         </div>
                     </div>
                </div>
            </div>
          </div>
        </div>
    );
  }
}

export default App
