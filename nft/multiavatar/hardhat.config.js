require("@nomiclabs/hardhat-waffle")

require("dotenv").config()

module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      gas: 2100000,
      gasPrice: 8000000000,
    },
    localhost: {
      url: "http://localhost:8545"
    },
    mumbai: {
      url: process.env.POLYGON_MUMBAI,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      url: process.env.POLYGON_MAIN,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
}
