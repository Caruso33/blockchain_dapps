const { ethers } = require("hardhat")

async function main() {
  const contractAddress = "0x148B94D622c2Ac3abfb550AEaF48F25F105EA18b"
  //   const contractFactory = await ethers.getContractFactory("NFTMarket")

  //   console.log({ contractFactory })

  //   const contract = await ethers.Contract(contractAddress, [])
  const contract = await ethers.getContractAt("NFTMarket", contractAddress)

  const listingPrice = await contract.getListingPrice()
  console.log({ listingPrice })
  //   console.log({ owner: await contract.owner() })
}

main()
