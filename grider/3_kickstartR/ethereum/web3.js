import Web3 from "web3"

let web3 = null

if (typeof windows !== "undefined" && window.ethereum) {
  // browser environment and metamask
  web3 = new Web3(ethereum)
} else if (typeof windows !== "undefined" && window.web3.currentProvider) {
  // browser environment and old metamask
  web3 = new Web3(window.web3.currentProvider)
} else {
  // we are on the server

  // create own provider through infura.io
  const provider = new Web3.providers.HttpProvider(process.env.network)
  web3 = new Web3(provider)
}

export default web3
