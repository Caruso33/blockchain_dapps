const { ethers } = require("hardhat")
const uploadedIpfsNfts = require("../output/uploaded.json")

require("dotenv").config()

async function main() {
  const contractAddress =
    process.env.CONTRACT_ADDRESS || "0x148B94D622c2Ac3abfb550AEaF48F25F105EA18b"
  const gatewayUrl = "https://gateway.pinata.cloud/ipfs/"
  const avatarPriceInEther = 0.01

  const signer = await ethers.getSigner()
  const contract = await ethers.getContractAt(
    "NFTMarket",
    contractAddress,
    signer
  )

  for (const [filename, nftData] of Object.entries(uploadedIpfsNfts)) {
    const metaDataLink = `${gatewayUrl}${nftData.metaData.IpfsHash}`

    const price = ethers.utils.parseUnits(
      avatarPriceInEther.toString(),
      "ether"
    )

    const listingPrice = (await contract.getListingPrice()).toString()

    try {
      const transaction = await contract.createToken(metaDataLink, price, {
        value: listingPrice,
      })
      await transaction.wait()
      console.log({ filename, metaDataLink, price })
    } catch (e) {
      console.error(e)
    }
  }
}

main()
