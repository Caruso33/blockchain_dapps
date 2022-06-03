const { ethers } = require("hardhat")
const { assert, expect } = require("chai")
const { Contract } = require("ethers")

describe("NFTMarket", async function () {
  let market = null
  let accounts = []
  let seller = null
  let buyer = null

  beforeEach(async () => {
    const Market = await ethers.getContractFactory("NFTMarket")
    market = await Market.deploy()
    await market.deployed()

    accounts = await ethers.getSigners()
    seller = accounts[0]
    buyer = accounts[1]

    // console.log({ seller: seller.address, buyer: buyer.address })
  })

  it("should create and execute market sales", async () => {
    const listingPrice = await market.getListingPrice()

    const auctionPrice = ethers.utils.parseUnits("100", "ether")

    const tokenURI = "https://tokenlocation.com"

    let tx = await market.createToken(tokenURI, auctionPrice, {
      value: listingPrice,
    })
    await market.createToken(`${tokenURI}/2`, auctionPrice, {
      value: listingPrice,
    })
    // console.log({ tx })
    // await expect(tx).to.emit("MarketItemCreated")
    // .withArgs(1, buyer.address, market.address, auctionPrice, false)

    let items = await market.fetchMarketItems()
    assert.equal(items.length, 2)
    // console.log({ beginning: items })

    await market.connect(buyer).createMarketSale(1, { value: auctionPrice })

    items = await market.fetchMarketItems()
    // console.log({ sold: items })

    assert.equal(items.length, 1)
    expect(items[0].tokenId).to.equal(2)
    expect(items[0].seller).to.equal(seller.address)
    expect(items[0].owner).to.equal(market.address)
    expect(items[0].price).to.equal(auctionPrice.toString())
    expect(items[0].sold).to.be.false
    expect(await market.tokenURI(items[0].tokenId)).to.equal(`${tokenURI}/2`)

    items = await market.fetchSoldMarketItems()
    assert.equal(items.length, 1)
    expect(items[0].seller).to.equal(ethers.constants.AddressZero)
    expect(items[0].owner).to.equal(buyer.address)
    expect(items[0].tokenId).to.equal(1)
    expect(items[0].sold).to.be.true

    items = await market.connect(seller).fetchNFTsCreated()
    // console.log({ created: items })
    assert.equal(items.length, 1)

    items = await market.connect(buyer).fetchMyNFTs()
    // console.log({ owned: items })
    assert.equal(items.length, 1)

    // await market.connect(buyer).resellToken(1, { value: listingPrice })
  })
})
