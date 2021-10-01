const HDWalletProvider = require("@truffle/hdwallet-provider")
const Web3 = require("web3")

const dotenv = require("dotenv")
dotenv.config()

const contracts = require("./compile")

const contractName = "Lottery"
const inboxContract = contracts[contractName]

const { evm, abi } = inboxContract

const provider = new HDWalletProvider(process.env.mnemonic, process.env.network)
const web3 = new Web3(provider)

let deployedContract = "",
  accounts = ""

;(async function () {
  try {
    accounts = await web3.eth.getAccounts()

    console.log("Deploy from accounts", accounts[0])

    deployedContract = await new web3.eth.Contract(abi)
      .deploy({
        data: `0x${evm.bytecode.object}`,
        arguments: [],
      })
      .send({ gas: "1000000", from: accounts[0] })
  } catch (e) {
    console.log("Error while deploying", e)
    return
  }

  console.log("Contract deployed to ", deployedContract.options.address)

  process.exit(0)
})()

// deployed to
// 0x53D4D0FFf2d9c62Ac51f15856eaB323802845A6b
