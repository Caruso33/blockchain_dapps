const StorageFactory = artifacts.require("StorageFactory")

const fs = require("fs")

module.exports = async function (deployer, _network, _accounts) {
  await deployer.deploy(StorageFactory)

  console.log("StorageFactory deployed to: ", StorageFactory.address)

  const config = {
    address: StorageFactory.address,
  }

  fs.writeFileSync(
    __dirname + "/../dapp/config.json",
    JSON.stringify(config, null, "\t"),
    "utf-8"
  )
}
