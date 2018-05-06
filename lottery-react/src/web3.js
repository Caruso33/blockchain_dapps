import Web3 from 'web3';

// using the provider from metamask
// which is already setup when using metamask in browser
// as a web3 object get injected
const web3 = new Web3(window.web3.currentProvider);

export default web3;
