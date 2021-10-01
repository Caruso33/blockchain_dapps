const HDWalletProvider = require("@truffle/hdwallet-provider")
const Web3 = require("web3")

const dotenv = require("dotenv")
dotenv.config()

const contracts = require("./compile")

const contractName = "Inbox"
const inboxContract = contracts[contractName]

const { evm, abi } = inboxContract

// using https://infura.io to deploy to test / main nets
// as connection point instead of having to set up a local
// node and deploying it from there

const provider = new HDWalletProvider(process.env.mnemonic, process.env.network)
const web3 = new Web3(provider)

const INITIAL_STRING = "Hi there!"
let deployedContract = "",
  accounts = ""

const deploy = async () => {
  try {
    accounts = await web3.eth.getAccounts()

    console.log("Deploy from accounts", accounts[0])

    deployedContract = await new web3.eth.Contract(abi)
      .deploy({
        data: `0x${evm.bytecode.object}`,
        arguments: [INITIAL_STRING],
      })
      .send({ gas: "1000000", from: accounts[0] })
  } catch (e) {
    console.log("Error while deploying", e)
    return
  }

  console.log("Contract deployed to", deployedContract.options.address)
}

deploy()

// deployed to
// 0xEf6d29dDFf75C3aC09C7AA37B3ea58aA2Bb24EB5
