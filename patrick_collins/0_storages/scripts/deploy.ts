// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import fs from "fs";
import path from "path";
import StorageFactoryArtifact from "../artifacts/contracts/StorageFactory.sol/StorageFactory.json";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const StorageFactory = await ethers.getContractFactory("StorageFactory");

  const storageFactory = await StorageFactory.deploy();
  await storageFactory.deployed();

  console.log("StorageFactory deployed to: ", storageFactory.address);

  const config = {
    address: storageFactory.address,
    abi: StorageFactoryArtifact.abi,
    bytecode: StorageFactory.bytecode,
  };

  fs.writeFileSync(
    path.join(__dirname, "/../dapp/src/utils/deployment.json"),
    JSON.stringify(config, null, "\t"),
    "utf-8"
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
