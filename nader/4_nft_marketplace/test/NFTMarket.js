const { ethers } = require("hardhat")
const { assert, expect } = require("chai")
const { Contract } = require("ethers")

describe("NFTMarket", async function () {
  let market = null
  let nft = null
  let accounts = []
  let seller = null
  let buyer = null

  beforeEach(async () => {
    const Market = await ethers.getContractFactory("NFTMarket")
    const NFT = await ethers.getContractFactory("NFT")
    market = await Market.deploy()
    await market.deployed()

    nft = await NFT.deploy(market.address)
    await nft.deployed()

    accounts = await ethers.getSigners()
    seller = accounts[0]
    buyer = accounts[1]

    console.log({ seller: seller.address, buyer: buyer.address })
  })

  it("should create and execute market sales", async () => {
    const listingPrice = await market.getListingPrice()

    const auctionPrice = ethers.utils.parseUnits("100", "ether")

    await nft.createToken("https://tokenlocation.com")
    await nft.createToken("https://tokenlocation2.com")

    await market.createMarketItem(nft.address, 1, auctionPrice, {
      value: listingPrice,
    })
    await market.createMarketItem(nft.address, 2, auctionPrice, {
      value: listingPrice,
    })

    let items = await market.fetchMarketItems()
    assert.equal(items.length, 2)
    console.log({ beginning: items })

    await market
      .connect(buyer)
      .createMarketSale(nft.address, 1, { value: auctionPrice })

    items = await market.fetchMarketItems()
    console.log({ sold: items })

    assert.equal(items.length, 1)
    expect(items[0].seller).to.equal(seller.address)
    expect(items[0].owner).to.equal(ethers.constants.AddressZero)
    expect(items[0].tokenId).to.equal(2)
    expect(items[0].sold).to.be.false

    items = await market.fetchSoldMarketItems()
    assert.equal(items.length, 1)
    expect(items[0].seller).to.equal(seller.address)
    expect(items[0].owner).to.equal(buyer.address)
    expect(items[0].tokenId).to.equal(1)
    expect(items[0].sold).to.be.true

    items = await market.connect(seller).fetchNFTsCreated()
    console.log({ created: items })
    assert.equal(items.length, 2)

    items = await market.connect(buyer).fetchMyNFTs()
    console.log({ owned: items })
    assert.equal(items.length, 1)
  })
})
