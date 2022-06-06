const HDWalletProvider = require("@truffle/hdwallet-provider")

require("dotenv").config()

const mumbai_provider = process.env.POLYGON_MUMBAI
const private_key = process.env.PRIVATE_KEY

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
      gas: 6721975,
    },

    mumbai: {
      provider: new HDWalletProvider([private_key], mumbai_provider),
      network_id: 80001,
    },
  },
  mocha: {
    // timeout: 100000
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.14",
      optimizer: {
        enabled: false,
        runs: 200,
      },
    },
  },
}
