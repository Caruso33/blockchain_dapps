require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
// require("solidity-coverage")
// require("hardhat-gas-reporter")

require("dotenv").config()

module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337,
      gas: 2100000,
      gasPrice: 8000000000,
    },
    localhost: {
      url: "http://localhost:8545",
    },
    mumbai: {
      url: process.env.NEXT_PUBLIC_POLYGON_MUMBAI,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      url: process.env.NEXT_PUBLIC_POLYGON_MAIN,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
}
