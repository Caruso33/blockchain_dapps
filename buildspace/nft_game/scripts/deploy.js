async function main() {
  const contractFactory = await hre.ethers.getContractFactory("EpicNFTGame")

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

  const contract = await contractFactory.deploy(...args)
  await contract.deployed()
  console.log("Contract deployed to:", contract.address)

  let txn
  txn = await contract.mintCharacterNFT(0)
  await txn.wait()
  console.log("Minted NFT #1")

  txn = await contract.mintCharacterNFT(1)
  await txn.wait()
  console.log("Minted NFT #2")

  txn = await contract.mintCharacterNFT(2)
  await txn.wait()
  console.log("Minted NFT #3")

  txn = await contract.mintCharacterNFT(2)
  await txn.wait()
  console.log("Minted NFT #4")

  console.log("Done deploying and minting!")
  
  txn = await contract.attackBoss();
  await txn.wait();
  
  txn = await contract.attackBoss();
  await txn.wait();

  console.log("Done attacking!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

// deployed on rinkeby - from new to old
// 0x717ab48149C1aE01CF4E23fDb577B058C9b630a0
// 0x142918CA2E8a74d92cfD40276a48FE817D928c4F
// 0xefC5373AfBf66D8CD367A0575Fd1B62b6C4b43a4
