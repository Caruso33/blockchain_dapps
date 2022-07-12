import { ethers } from "hardhat"
import fs from "fs"
import path from "path"
import FundMeArtifact from "../artifacts/contracts/FundMe.sol/FundMe.json"

// DEPRECATED:
// use `hardhat deploy` instead

async function main() {
  const factory = await ethers.getContractFactory("FundMe")

  const contract = await factory.deploy()
  await contract.deployed()

  console.log("FundMe deployed to: ", contract.address)

  const config = {
    address: contract.address,
    abi: FundMeArtifact.abi,
    bytecode: contract.bytecode,
  }

  fs.writeFileSync(
    path.join(__dirname, "/../dapp/src/utils/deployment.json"),
    JSON.stringify(config, null, "\t"),
    "utf-8"
  )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
