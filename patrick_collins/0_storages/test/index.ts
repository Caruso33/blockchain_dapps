import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("StorageFactory", function () {
  let contract: Contract;

  beforeEach(async () => {
    const factory = await ethers.getContractFactory("StorageFactory");

    contract = await factory.deploy();
    await contract.deployed();
  });

  it("should return the simpleStorageCounter", async function () {
    const simpleStorageCounter = await contract.simpleStorageCounter();

    expect(simpleStorageCounter).to.equal(0);
  });

  it("should return the simpleStorageCounter after incrementing it", async function () {
    await contract.createSimpleStorageContract();

    const simpleStorageCounter = await contract.simpleStorageCounter();

    expect(simpleStorageCounter).to.equal(1);
  });
});
