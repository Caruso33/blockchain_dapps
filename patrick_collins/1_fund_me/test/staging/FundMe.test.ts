import { assert } from "chai"
import { Contract } from "ethers"
import { ethers, getNamedAccounts, network } from "hardhat"
import { developmentChains } from "../../scripts/hardhat-helper-config"

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe Staging Tests", async function () {
      let deployer: string
      let contract: Contract
      const amount = ethers.utils.parseEther("0.01")

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        contract = await ethers.getContract("FundMe", deployer)
      })

      it("allows people to fund and withdraw", async function () {
        let tx = await contract.fund({ value: amount })
        await tx.wait()
        tx = await contract.withdraw({ gasLimit: 1000000 })
        await tx.wait()

        const endingFundMeBalance = await contract.provider.getBalance(
          contract.address
        )
        console.log(
          endingFundMeBalance.toString() +
            " should equal 0, running assert equal..."
        )
        assert.equal(endingFundMeBalance.toString(), "0")
      })
    })
