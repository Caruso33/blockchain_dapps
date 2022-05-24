import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ContractFactory, Contract, BigNumber, Event } from "ethers";
import { ethers } from "hardhat";

describe("Exchange contract", async function () {
  let contract: Contract;
  const feePercent = 10;

  const accounts = await ethers.getSigners();
  const owner: SignerWithAddress = accounts[0];
  const feeAccount: SignerWithAddress = accounts[1];

  const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("Exchange");

    contract = await Contract.deploy(await feeAccount.getAddress(), feePercent);
    contract = await contract.deployed();
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

  describe("Exchange contract", () => {
    let TokenContract: ContractFactory;
    let tokenContract: Contract;
    const tokenUser: SignerWithAddress = accounts[2];
    const etherAmount: BigNumber = ethers.utils.parseEther("1");
    const tokenAmount: BigNumber = ethers.utils.parseUnits("10", 18);

    beforeEach(async () => {
      TokenContract = await ethers.getContractFactory("Token");
      tokenContract = await TokenContract.deploy();
      tokenContract = await tokenContract.deployed();
      await tokenContract.transfer(tokenUser.address, tokenAmount);
    });

    async function approveAndDepositToken() {
      const txApprove = await tokenContract
        .connect(tokenUser)
        .approve(contract.address, tokenAmount);

      const txDeposit = await contract
        .connect(tokenUser)
        .depositToken(tokenContract.address, tokenAmount);

      return { txApprove, txDeposit };
    }

    describe("ether", () => {
      describe("success", () => {
        it("can deposit ether", async () => {
          await contract
            .connect(tokenUser)
            .depositEther({ value: ethers.utils.parseEther("1") });
        });

        it("tracks the ether deposit", async () => {
          await contract
            .connect(tokenUser)
            .depositEther({ value: etherAmount });
          const result = await contract.balances(
            ETHER_ADDRESS,
            tokenUser.address
          );

          expect(result).to.equal(etherAmount);
        });

        it("emits a deposit event", async () => {
          const tx = await contract
            .connect(tokenUser)
            .depositEther({ value: ethers.utils.parseEther("1") });

          await expect(tx)
            .to.emit(contract, "DepositEvent")
            .withArgs(
              ETHER_ADDRESS,
              tokenUser.address,
              etherAmount,
              etherAmount
            );
        });

        it("can withdraw ether", async () => {
          await contract
            .connect(tokenUser)
            .depositEther({ value: etherAmount });
          const result = await contract.balances(
            ETHER_ADDRESS,
            tokenUser.address
          );
          expect(result).to.equal(etherAmount);

          await contract.connect(tokenUser).withdrawEther(etherAmount);
          const result2 = await contract.balances(
            ETHER_ADDRESS,
            tokenUser.address
          );
          expect(result2).to.equal(ethers.constants.Zero);
        });

        it("emits a withdrawal event", async () => {
          await contract
            .connect(tokenUser)
            .depositEther({ value: etherAmount });
          const tx = await contract
            .connect(tokenUser)
            .withdrawEther(etherAmount);

          await expect(tx)
            .to.emit(contract, "WithdrawalEvent")
            .withArgs(ETHER_ADDRESS, tokenUser.address, etherAmount, 0);
        });
      });
    });

    describe("token", () => {
      describe("success", () => {
        it("can deposit a token", async () => {
          await approveAndDepositToken();
        });

        it("tracks the token deposit", async () => {
          // token contract
          const tokenBalanceBefore = await tokenContract.balanceOf(
            contract.address
          );
          await approveAndDepositToken();
          const tokenBalanceAfter = await tokenContract.balanceOf(
            contract.address
          );

          expect(tokenBalanceAfter.sub(tokenBalanceBefore).toString()).to.equal(
            tokenAmount.toString()
          );

          // exchange contract
          const tokenBalanceUser = await contract.balances(
            tokenContract.address,
            tokenUser.address
          );
          expect(tokenBalanceUser.toString()).to.equal(tokenAmount.toString());

          const tokenBalanceOwner = await contract.balances(
            tokenContract.address,
            owner.getAddress()
          );
          expect(tokenBalanceOwner.toString()).to.equal("0");
        });

        it("emits a deposit event", async () => {
          const { txDeposit } = await approveAndDepositToken();
          const tx = await txDeposit.wait();
          // tx has now additional props

          const event: Event = tx.events.find(
            (e: Event) => e.event === "DepositEvent"
          );
          // listen events on transaction
          // eslint-disable-next-line
          expect(event).to.not.be.undefined;
          expect(event.args).to.deep.equal([
            tokenContract.address,
            tokenUser.address,
            tokenAmount,
            tokenAmount,
          ]);

          // listen events on contract
          // 1st method
          await expect(txDeposit)
            .to.emit(contract, "DepositEvent")
            .withArgs(
              tokenContract.address,
              tokenUser.address,
              tokenAmount,
              tokenAmount
            );

          // 2nd method
          contract.on("DepositEvent", (from, to, amount, balance) => {
            expect(from).to.equal(tokenContract.address);
            expect(to).to.equal(tokenUser.address);
            expect(amount.toString()).to.equal(tokenAmount.toString());
            expect(balance.toString()).to.equal(tokenAmount.toString());
          });
        });
      });

      describe("failure", () => {
        it("fails when is not approved first", async () => {
          await expect(
            contract.depositToken(tokenContract.address, tokenAmount)
          ).to.be.reverted;

          await expect(
            contract.depositToken(tokenContract.address, tokenAmount)
          ).to.be.revertedWith("ERC20: insufficient allowance");
        });

        it("fails when the amount is zero", async () => {
          await tokenContract
            .connect(tokenUser)
            .approve(contract.address, tokenAmount);

          await expect(
            contract.depositToken(tokenContract.address, ethers.constants.Zero)
          ).to.be.revertedWith("Amount must be greater than 0");
        });

        it("fails when the amount is negative", async () => {
          await tokenContract
            .connect(tokenUser)
            .approve(contract.address, tokenAmount);

          await expect(
            contract.depositToken(
              tokenContract.address,
              ethers.utils.parseUnits("-1", 18)
            )
          ).to.be.reverted;
        });

        it("rejects ether deposits", async () => {
          await tokenContract
            .connect(tokenUser)
            .approve(contract.address, tokenAmount);

          await expect(
            contract.depositToken(tokenContract.address, tokenAmount, {
              value: ethers.utils.parseEther("1"),
            })
          ).to.be.reverted;

          await expect(contract.depositToken(0, tokenAmount)).to.be.reverted;
        });

        it("fails when the token does not exist", async () => {
          await tokenContract
            .connect(tokenUser)
            .approve(contract.address, tokenAmount);

          const addressOne = "0x0000000000000000000000000000000000000001";

          await expect(
            contract.depositToken(addressOne, tokenAmount)
          ).to.be.revertedWith("function call to a non-contract account");
        });
      });
    });

    it("reverts if ether is sent to fallback", async () => {
      await expect(
        tokenUser.sendTransaction({
          to: contract.address,
          value: ethers.utils.parseEther("1"),
        })
      ).to.be.reverted;
    });
  });
});
