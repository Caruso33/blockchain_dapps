const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const Config = require('./config');
const nodeUrl = 'https://rinkeby.infura.io/yB159JcQBkEA3EnqlXON';

// accounts number 1 !
const provider = new HDWalletProvider(Config.metamask, nodeUrl, 1);
const web3 = new Web3(provider);

const INITIAL_STRING = 'Hi there!';
let deployedContract = '',
  accounts = '';

const deploy = async () => {
  try {
    accounts = await web3.eth.getAccounts();

    console.log('Deploy from accounts', accounts[0]);

    deployedContract = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({
        data: `0x${bytecode}`
      })
      .send({ gas: '1000000', from: accounts[0] });
  } catch (e) {
    console.log('Error while deploying', e);
  }

  console.log('Contract deployed to', deployedContract.options.address);
};

deploy();
