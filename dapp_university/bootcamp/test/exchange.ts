import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ContractFactory, Contract, BigNumber } from "ethers";
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
    const tokenUser: SignerWithAddress = accounts[2];
    const tokenAmount: BigNumber = ethers.utils.parseUnits("10", 18);

    beforeEach(async () => {
      TokenContract = await ethers.getContractFactory("Token");
      tokenContract = await TokenContract.deploy();

      await tokenContract.deployed();
      await tokenContract.transfer(tokenUser.address, tokenAmount);
    });

    async function approveAndDepositToken() {
      await tokenContract
        .connect(tokenUser)
        .approve(contract.address, tokenAmount);

      await contract
        .connect(tokenUser)
        .depositToken(tokenContract.address, tokenAmount);
    }

    it("can deposit a token", async () => {
      await approveAndDepositToken();
    });

    it("tracks the token deposit", async () => {
      const tokenBalanceBefore = await tokenContract.balanceOf(
        contract.address
      );

      await approveAndDepositToken();

      const tokenBalanceAfter = await tokenContract.balanceOf(contract.address);

      expect(tokenBalanceAfter.sub(tokenBalanceBefore).toString()).to.equal(
        tokenAmount.toString()
      );
    });
  });
});
