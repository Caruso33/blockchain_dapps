require("dotenv").config()

const mnemonic = process.env["mnemonic"]
const infura_rinkeby_url = process.env["infura_rinkeby_url"]

const HDWalletProvider = require("truffle-hdwallet-provider")

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
    },

    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, infura_rinkeby_url)
      },
      network_id: 4,
    },
  },
}
