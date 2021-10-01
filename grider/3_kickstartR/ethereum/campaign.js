import web3 from "./web3"
import campaignAbi from "./contracts/bin/Campaign_abi.json"

export default (address) => {
  return new web3.eth.Contract(campaignAbi, address)
}
