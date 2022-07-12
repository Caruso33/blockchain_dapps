import { expect } from "chai"
import { Contract } from "ethers"
import { ethers, network } from "hardhat"
import {
  DECIMALS,
  developmentChains,
  INITIAL_PRICE,
} from "../scripts/hardhat-helper-config"

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function () {
      let contract: Contract

      beforeEach(async () => {
        const Aggregator = await ethers.getContractFactory("MockV3Aggregator")
        const aggregator = await Aggregator.deploy(DECIMALS, INITIAL_PRICE)
        await aggregator.deployed()

        const Contract = await ethers.getContractFactory("FundMe")

        contract = await Contract.deploy(aggregator.address)
        await contract.deployed()
      })

      it("should fund", async () => {
        const amount = ethers.utils.parseEther("1")
        await contract.fund({ value: amount })

        const balance = await ethers.provider.getBalance(contract.address)
        expect(balance).to.equal(amount)
      })
    })
