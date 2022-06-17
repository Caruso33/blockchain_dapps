require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")

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
    polygon: {
      url: process.env.NEXT_PUBLIC_POLYGON_MAIN,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    buyer: {
      default: 1,
    },
  },
  etherscan: {
    // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    apiKey: {
      mumbai: process.env.POLYSCAN_API_KEY,
      polygon: process.env.POLYSCAN_API_KEY,
      rinkeby: process.env.ETHERSCAN_API_KEY,
      kovan: process.env.ETHERSCAN_API_KEY,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "contracts/gas-report.txt",
    noColors: true,
    // coinmarketcap: process.env.COINMARKET_API_KEY,
  },
  mocha: {
    timeout: 100000, // 100 seconds max for running tests
  },
}
