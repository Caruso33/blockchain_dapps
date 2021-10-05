const HDWalletProvider = require("@truffle/hdwallet-provider")
const Web3 = require("web3")

const dotenv = require("dotenv")
dotenv.config()

const contracts = require("./compile")
const contractNames = ["CampaignFactory"]

const deploy = async (web3, { evm, abi }) => {
  let deployedContract = "",
    accounts = ""

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
}

;(async function () {
  for (const contractName of contractNames) {
    const inboxContract = contracts[contractName]

    const { evm, abi } = inboxContract

    const provider = new HDWalletProvider(
      process.env.mnemonic,
      process.env.network
    )
    const web3 = new Web3(provider)

    await deploy(web3, { evm, abi })
  }

  process.exit(0)
})()

// deployed to
// 0x10d7526150f4134d9B6631c8C4A6d812a91dFfA7
