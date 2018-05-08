const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const { nodeUrl, metamask } = require('./config');

// accounts number 1 !
const provider = new HDWalletProvider(metamask, nodeUrl, 1);
const web3 = new Web3(provider);

let deployedContract = '',
  accounts = '';

const deploy = async () => {
  try {
    accounts = await web3.eth.getAccounts();

    console.log('Deploy from accounts', accounts[0]);

    deployedContract = await new web3.eth.Contract(
      JSON.parse(compiledFactory.interface)
    )
      .deploy({
        data: `0x${compiledFactory.bytecode}`
      })
      .send({ gas: '1000000', from: accounts[0] });
  } catch (e) {
    console.log('Error while deploying', e);
  }

  console.log('Contract deployed to ', deployedContract.options.address);
};

deploy();
