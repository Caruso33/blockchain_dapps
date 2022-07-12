import * as dotenv from "dotenv"

import { HardhatUserConfig, task } from "hardhat/config"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-waffle"
import "@typechain/hardhat"
import "hardhat-gas-reporter"
import "solidity-coverage"
import "hardhat-deploy"

dotenv.config()

const mumbaiProvider = process.env.POLYGON_MUMBAI
const privateKey = process.env.PRIVATE_KEY

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.14" }, { version: "0.6.6" }],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: "http://localhost:8545",
      chainId: 1337,
    },
    mumbai: {
      url: mumbaiProvider,
      chainId: 80001,
      accounts: privateKey !== undefined ? [privateKey] : [],
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts: privateKey !== undefined ? [privateKey] : [],
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts: privateKey !== undefined ? [privateKey] : [],
      chainId: 4,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    noColors: true,
    outputFile: "gas-reporter.txt",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 100000,
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0, // use first account for mainnet (chainId 1)
    },
  },
}

export default config