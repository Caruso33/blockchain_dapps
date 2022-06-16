import { ethers } from "ethers"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Web3Modal from "web3modal"
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"
import { getNftData } from "../components/index/utils"
import { nftMarketAddress } from "../config"
import MarketItemInterface from "../types/MarketItemInterface"
import NftInterface from "../types/NftInterface"

export default function MyAssets() {
  const [nfts, setNfts] = useState<NftInterface[]>([])
  const [loadingState, setLoadingState] = useState("not-loaded")

  const router = useRouter()

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(
      nftMarketAddress,
      NFTMarket.abi,
      signer
    )

    let items: NftInterface[] = []
    try {
      const data = await contract.fetchMyNFTs()

      items = await Promise.all(
        data.map(async (nft: MarketItemInterface) => getNftData(nft, contract))
      )
    } catch (e: any) {
      console.error(e.message)
    }

    setNfts(items)
    setLoadingState("loaded")
  }

  function resellNFT(nft: NftInterface) {
    if (!nft.tokenURI) return

    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
  }

  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>

  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft: NftInterface, i) => {
            console.log({ nft })
            return (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                {nft.image && (
                  <Image
                    src={nft?.image}
                    className="rounded"
                    alt="Nft image"
                    height="100%"
                    width="100%"
                    layout="responsive"
                    objectFit="contain"
                    crossOrigin="anonymous"
                  />
                )}

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
                  <p className="text-2xl font-bold text-white">
                    Price - {nft?.price?.toString()} Eth
                  </p>

                  {nft.tokenURI && (
                    <button
                      className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                      onClick={() => resellNFT(nft)}
                    >
                      List
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
