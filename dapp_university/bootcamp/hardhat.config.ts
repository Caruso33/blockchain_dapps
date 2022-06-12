import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import seedExchange from "./scripts/seed-exchange";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy";


dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("seed-exchange", "Prefills the Exchange contract with orders")
  .addParam("token", "The address of token contract")
  .addParam("exchange", "The address of exchange contract")
  .setAction(async (taskArgs, hre) => {
    return seedExchange(taskArgs, hre);
  });

const mnemonic = process.env.mnemonic!;
// const HDNode = hre.ethers.utils.HDNode.fromMnemonic(mnemonic);
// const privateKey = HDNode.derivePath("m/44'/60'/0'/0/0").privateKey;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  defaultNetwork: "ganache",
  solidity: {
    version: "0.8.14",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  namedAccounts: {
    deployer: 0,
    feeAccount: 1,
  },
  paths: {
    sources: "contracts",
    deploy: "deploy", // default
    deployments: "deployments", // default
  },
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    rinkeby: {
      url: process.env.infura_rinkeby_url,
      accounts: {
        mnemonic: mnemonic,
      },
    },
    ganache: {
      url: process.env.GANACHE_URL || "http://localhost:8545",
      chainId: 1337
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
