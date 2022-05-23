import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ContractFactory, Contract } from "ethers";
import { ethers } from "hardhat";

describe("Exchange contract", async function () {
  let contract: Contract;
  const feePercent = 10;

  const accounts = await ethers.getSigners();
  const owner: SignerWithAddress = accounts[0];
  const feeAccount: SignerWithAddress = accounts[1];

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("Exchange");

    contract = await Contract.deploy(await feeAccount.getAddress(), feePercent);
    await contract.deployed();
  });

  describe("Exchange contract deployment", () => {
    it("sets correct owner", async () => {
      const result = await contract.owner();
      expect(result).to.equal(await owner.getAddress());
    });

    it("sets correct feeAccount", async () => {
      const result = await contract.feeAccount();
      expect(result).to.equal(await feeAccount.getAddress());
    });

    it("sets correct fee", async () => {
      const result = await contract.feePercent();
      expect(result).to.equal(feePercent);
    });
  });

  describe("Exchange contract tokens", () => {
    let TokenContract: ContractFactory;
    let tokenContract: Contract;

    beforeEach(async () => {
      TokenContract = await ethers.getContractFactory("Token");
      tokenContract = await TokenContract.deploy();
      await tokenContract.deployed();
    });

    it("can deposit a token", async () => {
      const tokenAmount = ethers.utils.parseUnits("10", 18);

      const tokenUser = accounts[2];
      await tokenContract.transfer(tokenUser.address, tokenAmount);

      await tokenContract
        .connect(tokenUser)
        .approve(contract.address, tokenAmount);

      const tokenBalanceBefore = await tokenContract.balanceOf(
        contract.address
      );
      await contract
        .connect(tokenUser)
        .depositToken(tokenContract.address, tokenAmount);
      const tokenBalanceAfter = await tokenContract.balanceOf(contract.address);

      expect(tokenBalanceAfter.sub(tokenBalanceBefore).toString()).to.equal(
        tokenAmount.toString()
      );
    });
  });
});
