import { ethers } from "ethers"
import Image from "next/image"
import { useEffect, useState } from "react"
import Web3Modal from "web3modal"
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"
import { getNftData } from "../components/index/utils"
import { getWeb3Connection } from "../components/web3/utils"
import { nftMarketAddress } from "../config"
import NftInterface, { NftData } from "../types/NftInterface"

export default function CreatorDashboard() {
  const [nftsCreated, setNftsCreated] = useState<NftData[]>([])
  const [nftsSelling, setNftsSelling] = useState<NftData[]>([])
  const [loadingState, setLoadingState] = useState("not-loaded")

  useEffect(() => {
    loadNFTsCreated()
    loadNFTsSelling()
  }, [])

  async function loadNFTsCreated() {
    const { signer } = await getWeb3Connection()

    const contract = new ethers.Contract(
      nftMarketAddress,
      NFTMarket.abi,
      signer
    )

    let items: NftData[] = []
    try {
      const data = await contract.fetchNFTsCreated()

      items = await Promise.all(
        data.map(async (nft: NftInterface) => getNftData(nft, contract))
      )
    } catch (e) {
      console.error(e.message)
    }

    setNftsCreated(items)
    setLoadingState("loaded")
  }

  async function loadNFTsSelling() {
    const { signer } = await getWeb3Connection()

    const contract = new ethers.Contract(
      nftMarketAddress,
      NFTMarket.abi,
      signer
    )

    let items: NftData[] = []
    try {
      const data = await contract.fetchNFTsSelling()

      items = await Promise.all(
        data.map(async (nft: NftInterface) => getNftData(nft, contract))
      )
    } catch (e) {
      console.error(e.message)
    }

    setNftsSelling(items)
    setLoadingState("loaded")
  }

  return (
    <div>
      <div className="p-4">
        <h2 className="text-2xl py-2">Items Created</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {loadingState === "loaded" && !nftsCreated.length ? (
            <h3 className="text-2xl py-2 px-5">No NFTs created</h3>
          ) : (
            nftsCreated.map((nft, i) => (
              <div
                key={`nfts-created-${i}`}
                className="border shadow rounded-xl overflow-hidden"
              >
                {nft.image && (
                  <Image
                    src={nft.image}
                    className="rounded"
                    alt="Nft image"
                    height="100%"
                    width="100%"
                    layout="responsive"
                    objectFit="contain"
                  />
                )}

                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">
                    Price - {nft?.price} Eth
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-2xl py-2">Items Selling</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {loadingState === "loaded" && !nftsSelling.length ? (
            <h3 className="text-2xl py-2 px-5">No NFTs selling</h3>
          ) : (
            nftsSelling.map((nft, i) => (
              <div
                key={`nfts-selling-${i}`}
                className="border shadow rounded-xl overflow-hidden"
              >
                {nft.image && (
                  <Image
                    src={nft?.image}
                    className="rounded"
                    alt="Nft image"
                    height="100%"
                    width="100%"
                    layout="responsive"
                    objectFit="contain"
                  />
                )}

                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">
                    Price - {nft?.price} Eth
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
