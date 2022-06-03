import axios from "axios"
import { ethers } from "ethers"
import Image from "next/image"
import { useEffect, useState } from "react"
import Web3Modal from "web3modal"
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"
import { nftMarketAddress } from "../config"

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState("not-loaded")

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider()
    const contract = new ethers.Contract(
      nftMarketAddress,
      NFTMarket.abi,
      provider
    )
    const data = await contract.fetchMarketItems()

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (item) => {
        const tokenUri = await contract.tokenURI(item.tokenId)
        const meta = await axios.get(tokenUri)
        const price = ethers.utils.formatUnits(item.price.toString(), "ether")

        return {
          price,
          tokenId: item.tokenId.toNumber(),
          seller: item.seller,
          owner: item.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        }
      })
    )
    setNfts(items)
    setLoadingState("loaded")
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(
      nftMarketAddress,
      NFTMarket.abi,
      signer
    )

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether")
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    })
    await transaction.wait()

    loadNFTs()
  }
  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>

  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <div>
                <Image
                  src={nft?.image}
                  alt="Nft image"
                  width="100%"
                  height="100%"
                  layout="responsive"
                  objectFit="contain"
                />
              </div>

              <div className="p-4">
                <p
                  style={{ height: "64px" }}
                  className="text-2xl font-semibold"
                >
                  {nft.name}
                </p>
                <div style={{ height: "70px", overflow: "hidden" }}>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="text-2xl font-bold text-white">{nft.price} ETH</p>
                <button
                  className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                  onClick={() => buyNft(nft)}
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
