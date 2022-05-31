require("@nomiclabs/hardhat-waffle")

require("dotenv").config()

module.exports = {
  solidity: "0.8.4",
  hardhat: {
    chainId: 1337,
  },
  mumbai: {
    url: process.env.POLYGON_MUMBAI,
    accounts: [process.env.PRIVATE_KEY]
  },
  mainnet: {
    url: process.env.POLYGON_MAIN,
    accounts: [process.env.PRIVATE_KEY]
  },
}
