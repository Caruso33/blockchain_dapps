import { ethers, getNamedAccounts } from "hardhat"

async function main() {
  const { deployer } = await getNamedAccounts()

  const fundMe = await ethers.getContract("FundMe", deployer)

  console.log(`Got contract FundMe at ${fundMe.address}`)
  console.log("Withdrawing from contract...")

  const tx = await fundMe.withdraw()
  await tx.wait()

  console.log("Got it back!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
