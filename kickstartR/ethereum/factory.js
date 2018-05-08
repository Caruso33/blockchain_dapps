import web3 from './web3';
import compiledFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(compiledFactory.interface),
  '0x48b4975a27528e00e8F887e9997395A84Eff8a05'
);

export default instance;
