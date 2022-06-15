const { ethers } = require("hardhat")
const uploadedIpfsNfts = require("../output/uploadedIpfs.json")
const fs = require("fs")

require("dotenv").config()

async function createMarketNfts(
  contractAddress,
  gatewayUrl,
  avatarPriceInEther,
  outputFilePath = "output/uploadedMarketNfts.json"
) {
  return new Promise(async (resolve, reject) => {
    const signer = await ethers.getSigner()
    const contract = await ethers.getContractAt(
      "NFTMarket",
      contractAddress,
      signer
    )

    const logs = {}
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
        logs[filename] = { filename, metaDataLink, price: price.toString() }
      } catch (e) {
        console.error(e)
      }
    }

    fs.writeFile(outputFilePath, JSON.stringify(logs), (err) => {
      if (err) reject()

      console.log(`The logs have been saved to ${outputFilePath}!`)
      resolve()
    })
  })
}

async function main() {
  const contractAddress =
    process.env.CONTRACT_ADDRESS || "0x148B94D622c2Ac3abfb550AEaF48F25F105EA18b"
  const gatewayUrl = "https://gateway.pinata.cloud/ipfs/"
  const avatarPriceInEther = 0.01

  const outputFilePath = "output/uploadedNft.json"

  try {
    await createMarketNfts(
      contractAddress,
      gatewayUrl,
      avatarPriceInEther,
      outputFilePath
    )
  } catch (error) {
    console.error(error)
  }
}

main()
