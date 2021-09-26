const HDWalletProvider = require("@truffle/hdwallet-provider")
const Web3 = require("web3")

const dotenv = require("dotenv")
dotenv.config()

const contractName = "Lottery"
const inboxContract = contracts[contractName]

const { evm, abi } = inboxContract

const provider = new HDWalletProvider(process.env.mnemonic, process.env.network)
const web3 = new Web3(provider)

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
  }

  console.log("Contract deployed to ", deployedContract.options.address)
}

deploy()
