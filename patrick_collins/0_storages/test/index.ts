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

  it("should return the simpleStorageValue after creating a simpleStorage", async function () {
    await contract.createSimpleStorageContract();

    const simpleStorageValue = await contract.sfGet(0);

    expect(simpleStorageValue).to.equal(0);
  });

  it("should save a simpleStorageValue", async function () {
    await contract.createSimpleStorageContract();

    await contract.sfStore(0, 1);

    const simpleStorageValue = await contract.sfGet(0);
    expect(simpleStorageValue).to.equal(1);
  });
});
