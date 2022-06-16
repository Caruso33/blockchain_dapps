import axios from "axios"
import { ethers } from "ethers"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"
import { getWeb3Connection } from "../components/web3/utils"
import { nftMarketAddress } from "../config"

export default function ResellNFT() {
  const [formInput, updateFormInput] = useState({ price: "", image: "" })
  const router = useRouter()
  const { id, tokenURI } = router.query
  const { image, price } = formInput

  useEffect(() => {
    async function fetchNFT() {
      if (!tokenURI) return

      try {
        const meta = await axios.get(tokenURI as string)

        updateFormInput((state) => ({ ...state, image: meta.data.image }))
      } catch (e) {
        console.error(e)
      }
    }

    fetchNFT()
  }, [id, tokenURI])

  async function listNFTForSale() {
    if (!price) return

    const { signer } = await getWeb3Connection()

    const priceFormatted = ethers.utils.parseUnits(formInput.price, "ether")
    let contract = new ethers.Contract(nftMarketAddress, NFTMarket.abi, signer)
    let listingPrice = await contract.getListingPrice()

    listingPrice = listingPrice.toString()
    let transaction = await contract.resellToken(id, priceFormatted, {
      value: listingPrice,
    })
    await transaction.wait()

    router.push("/")
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />

        {image && (
          <div className="rounded mt-4">
            <Image
              src={image}
              alt="Nft image"
              height="100%"
              width="100%"
              layout="responsive"
              objectFit="contain"
              crossOrigin="anonymous"
            />
          </div>
        )}

        <button
          onClick={listNFTForSale}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          List NFT
        </button>
      </div>
    </div>
  )
}
