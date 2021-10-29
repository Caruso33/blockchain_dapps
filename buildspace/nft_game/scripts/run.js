// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat")

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const NftGame = await hre.ethers.getContractFactory("EpicNFTGame")

  const characters = [
    ["Goku", "Aang", "Naruto"], // Names
    [
      "https://i.imgur.com/LG7T4kC.jpeg", // Images
      "https://i.imgur.com/xVu4vFL.png",
      "https://i.imgur.com/h1pN57c.jpeg",
    ],
    [100, 200, 250], // HP values
    [200, 100, 250], // Attack damage values
  ]

  const boss = ["Frieza", "https://i.imgur.com/0UpxKpK.jpeg", 10000, 50]

  const args = [...characters, ...boss]

  const nftGame = await NftGame.deploy(...args)

  await nftGame.deployed()

  console.log("NftGame deployed to:", nftGame.address)

  let txn
  // We only have three characters.
  // an NFT w/ the character at index 2 of our array.
  txn = await nftGame.mintCharacterNFT(2)
  await txn.wait()

  txn = await nftGame.attackBoss()
  await txn.wait()

  txn = await nftGame.attackBoss()
  await txn.wait()

  txn = await nftGame.attackBoss()
  await txn.wait()

  // Get the value of the NFT's URI.
  const returnedTokenUri = await nftGame.tokenURI(1)
  console.log("Token URI:", returnedTokenUri)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
