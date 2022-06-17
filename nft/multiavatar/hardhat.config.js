require("@nomiclabs/hardhat-waffle")

const { nftMarketAddress } = require("./config")
const createAvatars = require("./scripts/createAvatars")
const createMarketNfts = require("./scripts/createMarketNfts")
const uploadToIpfs = require("./scripts/uploadToIpfs")

require("dotenv").config()

task("createAvatars", "Create random avatar files")
  .addOptionalParam("numberOfAvatars", "How many avatars should be created")
  .setAction(async (taskArgs) => {
    const collectionName = "output"
    const numberOfAvatars = Number(taskArgs.numberOfAvatars) || 10

    createAvatars(collectionName, numberOfAvatars)
      .then((svgs) => {
        console.log(`done creating ${svgs.length} avatars`)
        process.exit(0)
      })
      .catch((error) => {
        console.log(error)
        process.exit(1)
      })
  })

task("uploadToIpfs", "Upload created avatars to IPFS").setAction(() => {
  const dirname = "output"
  const outputFilePath = "output/uploadedIpfs.json"

  uploadToIpfs(dirname, outputFilePath)
})

task("createMarketNfts", "Upload given Ipfs data to Market")
  .addOptionalParam("price", "Price in Ether for each NFT")
  .setAction(async (taskArgs, hre) => {
    const avatarPriceInEther = Number(taskArgs.price) || 0.01
    const gatewayUrl = "https://gateway.pinata.cloud/ipfs/"

    const inputFilePath = "output/uploadedIpfs.json"
    const outputFilePath = "output/uploadedNft.json"

    try {
      await createMarketNfts(
        hre,
        nftMarketAddress,
        gatewayUrl,
        avatarPriceInEther,
        inputFilePath,
        outputFilePath
      )
    } catch (error) {
      console.error(error)
    }
  })

module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      gas: 2100000,
      gasPrice: 8000000000,
    },
    localhost: {
      url: "http://localhost:8545",
    },
    mumbai: {
      url: process.env.POLYGON_MUMBAI,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      url: process.env.POLYGON_MAIN,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
}
