// import Web3 from 'web3';
const Web3 = require("web3")

let web3 = null

if (window.ethereum) {
  // using the provider from metamask
  // which is already setup when using metamask in browser
  // as a web3 object get injected
  web3 = new Web3(ethereum)
} else if (window.web3.currentProvider) {
  web3 = new Web3(window.web3.currentProvider)
}

export default web3
