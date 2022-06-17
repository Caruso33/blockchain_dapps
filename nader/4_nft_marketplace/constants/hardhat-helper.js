const NFTMarket = require("../artifacts/contracts/NFTMarket.sol/NFTMarket.json")
const contractAddresses = require("./contractAddresses.json")

const networkConfig = {
  default: {
    name: "hardhat",
  },
  1337: {
    name: "localhost",
  },
  4: {
    name: "rinkeby",
  },
  1: {
    name: "mainnet",
  },
  80001: {
    name: "mumbai",
  },
}

const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6
const contractArtifact = NFTMarket

module.exports = {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  contractArtifact,
  contractAddresses,
}
