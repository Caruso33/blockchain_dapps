import { assert, expect } from "chai"
import { BigNumber, Contract } from "ethers"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { developmentChains } from "../../scripts/hardhat-helper-config"

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe Unit Tests", async function () {
      let deployer: string
      let contract: Contract, aggregator: Contract
      const amount = ethers.utils.parseEther("1")

      beforeEach(async () => {
        // const Aggregator = await ethers.getContractFactory("MockV3Aggregator")
        // const aggregator = await Aggregator.deploy(DECIMALS, INITIAL_PRICE)
        // await aggregator.deployed()

        // const Contract = await ethers.getContractFactory("FundMe")

        // contract = await Contract.deploy(aggregator.address)
        // await contract.deployed()

        deployer = (await getNamedAccounts()).deployer

        await deployments.fixture(["all"]) // run all deploy scripts

        contract = await ethers.getContract("FundMe", deployer)
        aggregator = await ethers.getContract("MockV3Aggregator", deployer)
      })

      describe("public vars", () => {
        it("returns owner", async () => {
          const owner = await contract.getOwner()
          expect(owner).to.equal(deployer)
        })

        it("returns MINIMUM_USD", async () => {
          const MINIMUM_USD = await contract.MINIMUM_USD()
          assert.isTrue(BigNumber.isBigNumber(MINIMUM_USD))
        })
      })

      describe("constructor", async () => {
        it("sets the aggregator addresses correctly", async () => {
          const aggAddress = await contract.getPriceFeed()
          assert.equal(aggAddress, aggregator.address)
        })
      })

      describe("receive", async () => {
        it("should run fund function", async () => {
          const [owner] = await ethers.getSigners()

          let tx = await owner.sendTransaction({
            to: contract.address,
            value: amount,
          })

          const balance = await ethers.provider.getBalance(contract.address)
          assert(balance.toString(), amount.toString())

          await expect(tx).to.emit(contract, "Funded")
        })
      })

      describe("fallback", async () => {
        // it("should error on non-existent function", async () => {
        //   const [owner] = await ethers.getSigners()

        //   const nonExistentFuncSignature = "nonExistentFunction()"
        //   contract = new ethers.Contract(
        //     contract.address,
        //     [
        //       ...contract.interface.fragments,
        //       `function ${nonExistentFuncSignature}`,
        //     ],
        //     owner
        //   )

        //   let tx = await contract[nonExistentFuncSignature]({
        //     value: amount.toString(),
        //   })

        //   await expect(tx).to.emit(contract, "Error")
        // })

        it("should run fund function", async () => {
          const [owner] = await ethers.getSigners()

          let tx = await owner.sendTransaction({
            to: contract.address,
            value: amount,
            data: "0x",
          })

          const balance = await ethers.provider.getBalance(contract.address)
          assert(balance.toString(), amount.toString())

          await expect(tx).to.emit(contract, "Funded")
        })
      })

      describe("fund", () => {
        it("fails if you don't send enough Eth", async () => {
          await expect(contract.fund()).to.be.revertedWith(
            "FundMe__SendMoreEth()"
          )
        })

        it("updates the amount funded data structure", async () => {
          await contract.fund({ value: amount })

          const addressToAmountFunded = await contract.getAddressToAmountFunded(
            deployer
          )
          assert(addressToAmountFunded.toString(), amount.toString())
        })

        it("updates funders array", async () => {
          await contract.fund({ value: amount })

          const funder = await contract.getFunder(0)
          assert(funder, deployer)
        })

        it("should fund", async () => {
          let tx = await contract.fund({ value: amount })

          const balance = await ethers.provider.getBalance(contract.address)
          expect(balance).to.equal(amount)

          await expect(tx).to.emit(contract, "Funded")
        })
      })

      describe("withdraw", () => {
        beforeEach(async () => {
          await contract.fund({ value: amount })
        })

        it("fails when other than owner tries to withdraw", async () => {
          const [, attacker, anotherAttacker] = await ethers.getSigners()

          await expect(
            contract.connect(attacker).withdraw({ gasLimit: 1000000 })
          ).to.be.revertedWith("FundMe__NotOwner()")

          await expect(
            contract.connect(anotherAttacker).withdraw({ gasLimit: 1000000 })
          ).to.be.revertedWith("FundMe__NotOwner()")
        })

        it("should return the value", async () => {
          const startingFundMeBalance = await contract.provider.getBalance(
            contract.address
          )
          const startingDeployerBalance = await contract.provider.getBalance(
            deployer
          )

          let tx = await contract.withdraw()
          await expect(tx)
            .to.emit(contract, "Withdrawn")
            .withArgs(deployer, "0")

          tx = await tx.wait()

          const { gasUsed, effectiveGasPrice } = tx
          const gasCost = gasUsed.mul(effectiveGasPrice)

          const endingFundMeBalance = await contract.provider.getBalance(
            contract.address
          )
          const endingDeployerBalance = await contract.provider.getBalance(
            deployer
          )

          assert.equal(
            endingFundMeBalance.toString(),
            startingFundMeBalance.sub(amount).toString()
          )
          assert.equal(
            endingFundMeBalance.toString(),
            BigNumber.from("0").toString()
          )
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          )
          assert.equal(
            endingDeployerBalance.toString(),
            startingDeployerBalance.add(amount).sub(gasCost).toString()
          )
        })

        it("allows to withdraw with multiple funders", async () => {
          const accounts = await ethers.getSigners()

          for (let i = 1; i < accounts.length; i++) {
            const account = accounts[i]

            await contract.connect(account).fund({ value: amount })
          }

          const startingFundMeBalance = await contract.provider.getBalance(
            contract.address
          )
          const startingDeployerBalance = await contract.provider.getBalance(
            deployer
          )

          let tx = await contract.withdraw()
          await expect(tx)
            .to.emit(contract, "Withdrawn")
            .withArgs(deployer, "0")

          tx = await tx.wait()

          const { gasUsed, effectiveGasPrice } = tx
          const gasCost = gasUsed.mul(effectiveGasPrice)

          const endingFundMeBalance = await contract.provider.getBalance(
            contract.address
          )
          const endingDeployerBalance = await contract.provider.getBalance(
            deployer
          )

          assert.equal(
            endingFundMeBalance.toString(),
            startingFundMeBalance.sub(amount.mul(accounts.length)).toString()
          )
          assert.equal(
            endingFundMeBalance.toString(),
            BigNumber.from("0").toString()
          )
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          )
          assert.equal(
            endingDeployerBalance.toString(),
            startingDeployerBalance
              .add(amount.mul(accounts.length))
              .sub(gasCost)
              .toString()
          )

          for (let i = 1; i < accounts.length; i++) {
            const account = accounts[i]

            const balance = await contract.getAddressToAmountFunded(
              account.address
            )
            assert.equal(balance.toString(), BigNumber.from("0").toString())
          }

          await expect(contract.getFunders(0)).to.be.reverted
        })
      })

      describe("public getters", () => {
        it("should get owner", async () => {
          const owner = await contract.getOwner()

          assert.equal(owner, deployer)
        })

        it("should get funders", async () => {
          const [, other] = await ethers.getSigners()
          await contract.fund({ value: amount })
          await contract.connect(other).fund({ value: amount })

          const funders = await contract.getFunders()

          assert.equal(funders.length, 2)
          assert.equal(funders[0], deployer)
          assert.equal(funders[1], other.address)
        })

        it("should get funder", async () => {
          await expect(contract.getFunder(0)).to.be.reverted

          const [, other] = await ethers.getSigners()
          await contract.fund({ value: amount })
          await contract.connect(other).fund({ value: amount })

          let funder = await contract.getFunder(0)
          assert.equal(funder, deployer)

          funder = await contract.getFunder(1)
          assert.equal(funder, other.address)
        })

        it("should get address amount funded", async () => {
          let addressToAmountFunded = await contract.getAddressToAmountFunded(
            deployer
          )
          assert.equal(addressToAmountFunded.toString(), "0")

          await contract.fund({ value: amount })

          addressToAmountFunded = await contract.getAddressToAmountFunded(
            deployer
          )
          assert.equal(addressToAmountFunded.toString(), amount.toString())
        })

        it("should get price feed", async () => {
          const priceFeed = await contract.getPriceFeed()
          assert.equal(priceFeed, aggregator.address)
        })
      })
    })
