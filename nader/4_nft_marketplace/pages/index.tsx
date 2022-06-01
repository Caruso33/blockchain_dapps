import axios from "axios"
import { ethers } from "ethers"
import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import { useEffect, useState } from "react"
import Web3Modal from "web3modal"
import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"
import { nftAddress, nftMarketAddress } from "../config"

const Home: NextPage = () => {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState("not-loaded")

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider()
    const marketContract = new ethers.Contract(
      nftMarketAddress,
      NFTMarket.abi,
      provider
    )
    const nftContract = new ethers.Contract(nftAddress, NFT.abi, provider)
    console.log({ marketContract })

    const nfts = await marketContract.fetchMarketItems()
    const items = await Promise.all(
      nfts.map(async (nft) => {
        const tokenURI = await nftContract.tokenURI(nft.tokenId)
        // const { data } = await axios.get(tokenURI)
        const price = ethers.utils.formatUnits(nft.price.toString(), "ether")
        return {
          price,
          seller: nft.seller,
          owner: nft.owner,
          image: data?.image,
          name: data?.name,
          description: data?.description,
        }
      })
    )

    // setNfts(items)
    setLoadingState("loaded")
  }

  async function buyNFT(nft: object) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)

    const signer = provider.getSigner()
    const contract = new ethers.Contract(
      nftMarketAddress,
      NFTMarket.abi,
      signer
    )

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether")

    const tx = await contract.createMarketSale(nftAddress, nft.tokenId, {
      value: price,
    })
    await tx.wait()

    loadNFTs()
  }

  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex justify-center">
        <div className="px-4" style={{ maxWidth: "1600px" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {nfts.map((nft, i) => (
              <div
                key={`nft-list-${i}`}
                className="border shadow rounded-xl overflow-hidden"
              >
                <Image src={nft?.image} alt="Nft image" />
                <div className="p-4">
                  <p
                    style={{ height: "64px" }}
                    className="text-2xl font-semibold"
                  >
                    {nft?.name}
                  </p>
                  <div style={{ height: "70px", overflow: "hidden" }}>
                    <p className="text-gray-400">{nft?.description}</p>
                  </div>
                </div>

                <div className="p-4 bg-black">
                  <p className="text-2xl mb-4 font-bold text-white">
                    {nft?.price} Matic
                  </p>
                  <button
                    className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                    onClick={() => buyNFT(nft)}
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
