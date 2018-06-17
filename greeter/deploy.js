const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const compiledContractBin = require('./build/Greeter.bin');
const compiledContractAbi = require('./build/Greeter.abi');

let nodeUrlCon, metamask;

if (process.env.NODE_ENV === 'production') {
  nodeUrlCon = process.env.NODE_URL;
  metamask = process.env.METAMASK;
} else {
  const { nodeUrl, metamask } = require('./config.js');
  nodeUrlCon = nodeUrl;
}
// accounts number 1 !
const provider = new HDWalletProvider(metamask, nodeUrlCon, 1);
const web3 = new Web3(provider);

let deployedContract = '',
  accounts = '';

const deploy = async () => {
  try {
    accounts = await web3.eth.getAccounts();

    console.log('Deploy from accounts', accounts[0]);

    deployedContract = await new web3.eth.Contract(compiledContractAbi)
      .deploy({
        data: `0x${compiledContractBin}`
      })
      .send({ gas: '1000000', from: accounts[0] });
  } catch (e) {
    console.log('Error while deploying', e);
  }

  console.log('Contract deployed to ', deployedContract.options.address);
};

deploy();
