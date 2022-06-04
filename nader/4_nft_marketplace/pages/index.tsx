import { ethers } from "ethers"
import Image from "next/image"
import { useEffect, useState } from "react"
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"
import { getNftData } from "../components/index/utils"
import { getWeb3Connection } from "../components/web3/utils"
import { nftMarketAddress } from "../config"
import NftInterface, { NftData } from "../types/NftInterface"

export default function Home() {
  const [nfts, setNfts] = useState<NftData[]>([])
  const [loadingState, setLoadingState] = useState("not-loaded")

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */

    if (!process.env.NEXT_PUBLIC_DEPLOYED_NETWORK) {
      throw Error("No deployed network env set!")
    }

    let rpcProviderUrl = ""
    if (process.env.NEXT_PUBLIC_DEPLOYED_NETWORK === "mumbai")
      rpcProviderUrl = process.env.NEXT_PUBLIC_POLYGON_MUMBAI!
    if (process.env.NEXT_PUBLIC_DEPLOYED_NETWORK === "polygon")
      rpcProviderUrl = process.env.NEXT_PUBLIC_POLYGON_MAIN!

    const provider = new ethers.providers.JsonRpcProvider(rpcProviderUrl)
    const contract = new ethers.Contract(
      nftMarketAddress,
      NFTMarket.abi,
      provider
    )

    let items: NftData[] = []
    try {
      const data = await contract.fetchMarketItems()

      /*
       *  map over items returned from smart contract and format
       *  them as well as fetch their token metadata
       */
      items = await Promise.all(
        data.map(async (nft: NftInterface) => getNftData(nft, contract))
      )
    } catch (e: any) {
      console.error(e.message)
    }

    setNfts(items)
    setLoadingState("loaded")
  }

  async function buyNft(nft: NftData) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const { signer } = await getWeb3Connection()
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
            <div
              key={`nft-listing-${i}`}
              className="border shadow rounded-xl overflow-hidden"
            >
              {nft.image && (
                <Image
                  src={nft.image}
                  alt="Nft image"
                  width="100%"
                  height="100%"
                  layout="responsive"
                  objectFit="contain"
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
                  {nft?.price} ETH
                </p>
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
