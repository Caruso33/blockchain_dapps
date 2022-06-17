const { contractAddressesPath } = require("../constants/hardhat-helper")
const fs = require("fs")
const { network } = require("hardhat")

module.exports = async ({ deployments }) => {
  const { log } = deployments

  const contract = await ethers.getContract("NFTMarket")

  log("Updating addresses...")
  const contractAddresses = JSON.parse(
    fs.readFileSync(contractAddressesPath, "utf8")
  )

  contractAddresses[network.config.chainId.toString()] = contract.address

  fs.writeFileSync(contractAddressesPath, JSON.stringify(contractAddresses))

  log("----------------------------------------------------")
}

module.exports.tags = ["all", "addresses"]
