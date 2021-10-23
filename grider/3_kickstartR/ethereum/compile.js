// const path = require("path")
// const solc = require("solc")
// const fs = require("fs-extra")

// const buildPath = path.resolve(__dirname, "build")
// fs.removeSync(buildPath)

// const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol")
// const source = fs.readFileSync(campaignPath, "utf8")
// const output = solc.compile(source, 1).contracts

// fs.ensureDirSync(buildPath)

// for (let contract in output) {
//   fs.outputJsonSync(
//     path.resolve(buildPath, `${contract.replace(":", "")}.json`),
//     output[contract]
//   )
// }

const path = require("path")
const fs = require("fs")
const solc = require("solc")

const contractsPath = "contracts"
const contractsBinPath = path.join(contractsPath, "/bin")
const contractName = "Campaign.sol"

const contractPath = path.resolve(__dirname, contractsPath, contractName)
const source = fs.readFileSync(contractPath, "utf8")

const input = {
  language: "Solidity",
  sources: { [contractName]: { content: source } },
  settings: {
    optimizer: { enabled: true },
    outputSelection: { "*": { "*": ["*"] } },
  },
}

const compiledContracts = JSON.parse(solc.compile(JSON.stringify(input), {}))

console.log("compiledContracts", compiledContracts, "\n")

fs.promises.mkdir(contractsBinPath, { recursive: true }).catch(console.error)

const contracts = {}

for (let compiledContractName in compiledContracts.contracts[contractName]) {
  const compiledContract =
    compiledContracts.contracts[contractName][compiledContractName]

  contracts[compiledContractName] = compiledContract

  const abi = compiledContract.abi

  console.log(compiledContractName, abi)

  fs.writeFileSync(
    `${contractsBinPath}/${compiledContractName}_abi.json`,
    JSON.stringify(abi)
  )
}

module.exports = contracts
