import Web3 from 'web3';

let nodeUrlCon, web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider);
} else {
  // we are on server *OR* user is not running metamask
  if (process.env.NODE_ENV === 'production') {
    nodeUrlCon = process.env.NODE_URL;
  } else {
    const { nodeUrl } = require('./config.js');
    nodeUrlCon = nodeUrl;
  }
  const provider = new Web3.providers.HttpProvider(nodeUrlCon);
  web3 = new Web3(provider);
}

export default web3;
