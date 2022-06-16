const { ethers } = require("hardhat")
const { assert, expect } = require("chai")
const { Contract } = require("ethers")

describe("NFTMarket", async function () {
  let market = null
  let accounts = []
  let seller = null
  let buyer = null

  const auctionPrice = ethers.utils.parseUnits("1", "ether")
  const tokenURI = "https://tokenlocation.com"

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

    let tx = await market.createToken(tokenURI, auctionPrice, {
      value: listingPrice,
    })
    await market.createToken(`${tokenURI}/2`, auctionPrice, {
      value: listingPrice,
    })
    tx = await tx.wait()

    const events = tx.events.filter((e) => e.event === "MarketItemCreated")

    expect(events.length).to.equal(1)
    expect(events[0].args.tokenId).to.equal(1)
    expect(events[0].args.seller).to.equal(seller.address)
    expect(events[0].args.owner).to.equal(market.address)
    expect(events[0].args.price).to.equal(auctionPrice)

    let items = await market.fetchMarketItems()
    assert.equal(items.length, 2)
    // console.log({ beginning: items })

    tx = await market
      .connect(buyer)
      .createMarketSale(1, { value: auctionPrice })
    const timestamp = (await ethers.provider.getBlock(tx.blockNumber)).timestamp

    await expect(tx)
      .to.emit(market, "MarketItemSold")
      .withArgs(1, seller.address, buyer.address, auctionPrice, timestamp)

    items = await market.fetchMarketItems()
    // console.log({ sold: items })

    assert.equal(items.length, 1)
    expect(items[0].tokenId).to.equal(2)
    expect(items[0].seller).to.equal(seller.address)
    expect(items[0].owner).to.equal(market.address)
    expect(items[0].price).to.equal(auctionPrice.toString())
    expect(items[0].sold).to.be.false
    expect(items[0].prevOwners).to.deep.equal([seller.address])
    expect(await market.tokenURI(items[0].tokenId)).to.equal(`${tokenURI}/2`)

    items = await market.fetchSoldMarketItems()
    assert.equal(items.length, 1)
    expect(items[0].seller).to.equal(ethers.constants.AddressZero)
    expect(items[0].owner).to.equal(buyer.address)
    expect(items[0].tokenId).to.equal(1)
    expect(items[0].sold).to.be.true

    items = await market.connect(seller).fetchNFTsCreated()
    // console.log({ created: items })
    assert.equal(items.length, 2)

    items = await market.connect(buyer).fetchMyNFTs()
    // console.log({ owned: items })
    assert.equal(items.length, 1)

    await market
      .connect(buyer)
      .resellToken(1, auctionPrice, { value: listingPrice })
    items = await market.connect(buyer).fetchNFTsSelling()
    expect(items[0].tokenId).to.equal(1)
    expect(items[0].seller).to.equal(buyer.address)
    expect(items[0].owner).to.equal(market.address)
    expect(items[0].price).to.equal(auctionPrice)
    expect(items[0].prevOwners).to.deep.equal([seller.address, buyer.address])
  })

  it("burn token and revoke selling works as expected", async () => {
    const listingPrice = await market.getListingPrice()

    let tx = await market.createToken(tokenURI, auctionPrice, {
      value: listingPrice,
    })
    await market.createToken(`${tokenURI}/2`, auctionPrice, {
      value: listingPrice,
    })
    await market.createToken(`${tokenURI}/3`, auctionPrice, {
      value: listingPrice,
    })

    let items = await market.fetchMarketItems()
    assert.equal(items.length, 3)
    // console.log({ beginning: items })

    tx = await market
      .connect(buyer)
      .createMarketSale(1, { value: auctionPrice })

    items = await market.fetchMarketItems()
    assert.equal(items.length, 2)
    // console.log({ sold: items })

    tx = await market.connect(seller).burnToken(2)
    const timestamp = (await ethers.provider.getBlock(tx.blockNumber)).timestamp

    items = await market.connect(seller).fetchNFTsSelling()
    await expect(tx)
      .to.emit(market, "MarketItemBurned")
      .withArgs(2, seller.address, auctionPrice, timestamp)
    expect(items.length).to.equal(1)

    items = await market.connect(buyer).fetchMyNFTs()
    expect(items.length).to.equal(1)
    tx = await market.connect(buyer).burnToken(1)
    items = await market.connect(buyer).fetchMyNFTs()
    expect(items.length).to.equal(0)

    items = await market.fetchNFTsCreated()
    expect(items.length).to.equal(1)
    expect(items[0].tokenId).to.equal(3)

    items = await market.fetchNFTsSelling()
    expect(items.length).to.equal(1)
    expect(items[0].tokenId).to.equal(3)
    expect(items[0].seller).to.equal(seller.address)
    expect(items[0].owner).to.equal(market.address)

    await market.revokeMarketItem(3)
    items = await market.fetchNFTsSelling()
    expect(items.length).to.equal(0)
    items = await market.fetchMyNFTs()
    expect(items[0].tokenId).to.equal(3)
    expect(items[0].owner).to.equal(seller.address)
    expect(items[0].seller).to.equal(ethers.constants.AddressZero)
  })
})
