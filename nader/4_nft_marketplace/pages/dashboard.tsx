import { ethers } from "ethers"
import Image from "next/image"
import { useEffect, useState } from "react"
import { getNftData } from "../components/index/utils"
import Spinner from "../components/Spinner"
import { getWeb3Connection } from "../components/web3/utils"
import { contractArtifact, contractAddresses } from "../constants/hardhat-helper"
import MarketItemInterface from "../types/MarketItemInterface"
import NftInterface from "../types/NftInterface"

export default function CreatorDashboard() {
  const [nftsCreated, setNftsCreated] = useState<NftInterface[]>([])
  const [nftsSelling, setNftsSelling] = useState<NftInterface[]>([])
  const [loadingState, setLoadingState] = useState("not-loaded")
  const [loadingBurnOrRevoke, setLoadingBurnOrRevoke] = useState(false)

  useEffect(() => {
    loadNFTsCreated()
    loadNFTsSelling()
  }, [])

  async function loadNFTsCreated() {
    const { network, signer } = await getWeb3Connection()

    const contract = new ethers.Contract(
      contractAddresses[network.chainId],
      contractArtifact.abi,
      signer
    )

    setLoadingState("not-loaded")

    let items: NftInterface[] = []
    try {
      const data = await contract.fetchNFTsCreated()

      items = await Promise.all(
        data.map(async (nft: MarketItemInterface) => getNftData(nft, contract))
      )
    } catch (e: any) {
      console.error(e.message)
    }

    setNftsCreated(items)
    setLoadingState("loaded")
  }

  async function loadNFTsSelling() {
    const { network, signer } = await getWeb3Connection()

    const contract = new ethers.Contract(
      contractAddresses[network.chainId],
      contractArtifact.abi,
      signer
    )

    setLoadingState("not-loaded")

    let items: NftInterface[] = []
    try {
      const data = await contract.fetchNFTsSelling()

      items = await Promise.all(
        data.map(async (nft: MarketItemInterface) => getNftData(nft, contract))
      )
    } catch (e: any) {
      console.error(e.message)
    }

    setNftsSelling(items)
    setLoadingState("loaded")
  }

  async function burnNft(nft: NftInterface) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    try {
      const { signer } = await getWeb3Connection()
      const contract = new ethers.Contract(
        nftMarketAddress,
        NFTMarket.abi,
        signer
      )
      setLoadingBurnOrRevoke(true)

      /* this will delete the nft */
      const transaction = await contract.burnToken(nft.tokenId)
      await transaction.wait()
    } catch (error) {
      console.error(error)
    }

    setLoadingBurnOrRevoke(false)

    loadNFTsCreated()
    loadNFTsSelling()
  }

  async function revokeNft(nft: NftInterface) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    try {
      const { signer } = await getWeb3Connection()
      const contract = new ethers.Contract(
        nftMarketAddress,
        NFTMarket.abi,
        signer
      )
      setLoadingBurnOrRevoke(true)

      /* this will delete the nft */
      const transaction = await contract.revokeMarketItem(nft.tokenId)
      await transaction.wait()
    } catch (error) {
      console.error(error)
    }

    setLoadingBurnOrRevoke(false)

    loadNFTsCreated()
    loadNFTsSelling()
  }

  return (
    <div>
      <div className="p-4">
        <h2 className="text-2xl py-2">Items Created</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {loadingState === "not-loaded" && <Spinner />}

          {loadingState === "loaded" &&
            (!nftsCreated.length ? (
              <h3 className="text-2xl py-2 px-5">No NFTs created</h3>
            ) : (
              nftsCreated.map((nft, i) => (
                <div
                  key={`nfts-created-${i}`}
                  className="flex flex-col border shadow rounded-xl overflow-hidden"
                >
                  {nft.image ? (
                    <Image
                      src={nft.image}
                      alt="Nft image"
                      width="100%"
                      height="100%"
                      layout="responsive"
                      objectFit="contain"
                      crossOrigin="anonymous"
                      unoptimized={true}
                    />
                  ) : (
                    <div style={{ height: "100%", width: "100%" }} />
                  )}

                  <div className="p-4">
                    <p
                      style={{ height: "64px" }}
                      className="text-2xl font-semibold"
                    >
                      {nft?.name}
                    </p>
                  </div>

                  <div className="p-4 bg-black">
                    <p className="text-2xl font-bold text-white">
                      Price - {nft?.price?.toString()} Eth
                    </p>
                  </div>
                </div>
              ))
            ))}
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-2xl py-2">Items Selling</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {loadingState === "not-loaded" && <Spinner />}

          {loadingState === "loaded" &&
            (!nftsSelling.length ? (
              <h3 className="text-2xl py-2 px-5">No NFTs selling</h3>
            ) : (
              nftsSelling.map((nft, i) => (
                <div
                  key={`nfts-selling-${i}`}
                  className="flex flex-col border shadow rounded-xl overflow-hidden"
                >
                  {nft.image ? (
                    <Image
                      src={nft.image}
                      alt="Nft image"
                      width="100%"
                      height="100%"
                      layout="responsive"
                      objectFit="contain"
                      crossOrigin="anonymous"
                      unoptimized={true}
                    />
                  ) : (
                    <div style={{ height: "100%", width: "100%" }} />
                  )}

                  <div className="p-4">
                    <p
                      style={{ height: "64px" }}
                      className="text-2xl font-semibold"
                    >
                      {nft?.name}
                    </p>
                  </div>

                  <div className="p-4 bg-black">
                    <p className="text-2xl font-bold text-white">
                      Price - {nft?.price?.toString()} Eth
                    </p>

                    <div className="flex flex-col">
                      <button
                        className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                        onClick={() => revokeNft(nft)}
                        disabled={loadingBurnOrRevoke}
                      >
                        {!loadingBurnOrRevoke ? "Revoke Selling" : <Spinner />}
                      </button>

                      <button
                        className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                        onClick={() => burnNft(nft)}
                        disabled={loadingBurnOrRevoke}
                      >
                        {!loadingBurnOrRevoke ? "Burn" : <Spinner />}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ))}
        </div>
      </div>
    </div>
  )
}
