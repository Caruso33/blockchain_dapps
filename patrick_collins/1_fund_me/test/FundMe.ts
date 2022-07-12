import { expect } from "chai"
import { Contract } from "ethers"
import { ethers } from "hardhat"

describe("FundMe", function () {
  let contract: Contract

  beforeEach(async () => {
    const factory = await ethers.getContractFactory("FundMe")

    contract = await factory.deploy()
    await contract.deployed()
  })

  it("should fund", async () => {
    const amount = ethers.utils.parseEther("1")
    await contract.fund({ value: amount })

    // const balance = await contract.getBalance()
    // expect(balance).to.equal(amount)
  })
})
