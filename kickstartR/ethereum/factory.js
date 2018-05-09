import web3 from './web3';
import compiledFactory from './build/CampaignFactory.json';

let contractAddress;

if (process.env.NODE_ENV === 'production') {
  contractAddress = process.env.FACTORY_ADDRESS;
} else {
  const { factoryAddress } = require('./config');
  contractAddress = factoryAddress;
}

const instance = new web3.eth.Contract(
  JSON.parse(compiledFactory.interface),
  contractAddress
);

export default instance;
