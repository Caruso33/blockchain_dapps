import Web3 from 'web3';
import { nodeUrl } from './config.js';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider);
} else {
  // we are on server *OR* user is not running metamask
  const provider = new Web3.providers.HttpProvider(nodeUrl);
  web3 = new Web3(provider);
}

export default web3;
