const { ethers } = require("hardhat")
const fs = require("fs")
const { nftMarketAddress } = require("../config")
const yargs = require("yargs")

// var argv = require('yargs/yargs')(process.argv.slice(2)).argv;
const argv = yargs.option("price", {
  alias: "pr",
  description: "Price in Ether for each NFT",
  type: "number",
})

require("dotenv").config()

async function createMarketNfts(
  contractAddress,
  gatewayUrl,
  avatarPriceInEther,
  inputFilePath = "output/uploadedIpfs.json",
  outputFilePath = "output/uploadedMarketNfts.json"
) {
  return new Promise(async (resolve, reject) => {
    const signer = await ethers.getSigner()
    const contract = await ethers.getContractAt(
      "NFTMarket",
      contractAddress,
      signer
    )

    let uploadedIpfsNfts
    try {
      uploadedIpfsNfts = fs.readFileSync(inputFilePath, {
        encoding: "utf8",
        flag: "r",
      })
      uploadedIpfsNfts = JSON.parse(uploadedIpfsNfts)
    } catch (e) {
      console.error(
        `Error: ${e.message}\n`,
        `There was a problem opening ${inputFilePath}. Did you forget to run "yarn run upload:files"?`
      )
      process.exit(1)
    }

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
  const gatewayUrl = "https://gateway.pinata.cloud/ipfs/"
  const avatarPriceInEther = argv.price || 0.01

  const inputFilePath = "output/uploadedIpfs.json"
  const outputFilePath = "output/uploadedNft.json"

  try {
    await createMarketNfts(
      nftMarketAddress,
      gatewayUrl,
      avatarPriceInEther,
      inputFilePath,
      outputFilePath
    )
  } catch (error) {
    console.error(error)
  }
}

main()
