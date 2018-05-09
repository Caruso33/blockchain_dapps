import web3 from './web3';
import compiledFactory from './build/CampaignFactory.json';

let contractAddres;

if (process.env.NODE_ENV === 'production') {
  contractAddres = process.env.FACTORY_ADDRESS;
} else {
  const { factoryAdress } = require('./config');
  contractAddres = factoryAdress;
}

const instance = new web3.eth.Contract(
  JSON.parse(compiledFactory.interface),
  contractAddres
);

export default instance;
