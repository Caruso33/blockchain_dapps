const path = require("path")
const fs = require("fs")
const solc = require("solc")

const contractsPath = "contracts"
const contractsBinPath = path.join(__dirname, contractsPath, "bin")
const contractNames = ["Campaign.sol"]

const contracts = {}

for (const contractName of contractNames) {
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

  fs.mkdirSync(contractsBinPath, { recursive: true })

  for (let compiledContractName in compiledContracts.contracts[contractName]) {
    const compiledContract =
      compiledContracts.contracts[contractName][compiledContractName]

    contracts[compiledContractName] = compiledContract

    const abi = compiledContract.abi

    console.log(compiledContractName, abi)

    fs.writeFileSync(
      path.join(contractsBinPath, `${compiledContractName}_abi.json`),
      JSON.stringify(abi)
    )
  }
}

module.exports = contracts
