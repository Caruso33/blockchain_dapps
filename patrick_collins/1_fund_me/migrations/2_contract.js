const FundMe = artifacts.require("FundMe")

const fs = require("fs")

module.exports = async function (deployer, _network, _accounts) {
  await deployer.deploy(FundMe)

  console.log("FundMe deployed to: ", FundMe.address)

  const config = {
    address: FundMe.address,
  }

  fs.writeFileSync(
    __dirname + "/../dapp/public/config.json",
    JSON.stringify(config, null, "\t"),
    "utf-8"
  )
}
