import web3 from "./web3"
import factoryAbi from "./contracts/bin/CampaignFactory_abi.json"

const getFactory = (address) => new web3.eth.Contract(factoryAbi, address)

export default getFactory
