import { ethers } from "ethers"
import { create as ipfsHttpClient } from "ipfs-http-client"
import Image from "next/image"
import { useRouter } from "next/router"
import { ChangeEvent, useState } from "react"
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"
import { getWeb3Connection } from "../components/web3/utils"
import { nftMarketAddress } from "../config"

const client = ipfsHttpClient({ url: "https://ipfs.infura.io:5001/api/v0" })

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  })
  const router = useRouter()

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e?.target?.files?.[0]
    if (!file) return

    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      })

      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log("Error uploading file: ", error)
    }
  }

  async function uploadToIPFS() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return

    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    })

    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url
    } catch (error) {
      console.log("Error uploading file: ", error)
    }
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS()

    const { signer } = await getWeb3Connection()

    /* next, create the item */
    const price = ethers.utils.parseUnits(formInput.price, "ether")
    const contract = new ethers.Contract(
      nftMarketAddress,
      NFTMarket.abi,
      signer
    )
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    try {
      const transaction = await contract.createToken(url, price, {
        value: listingPrice,
      })
      await transaction.wait()
    } catch (e) {
      console.error(e)
    }

    router.push("/")
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />

        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />

        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={(e) => onChange(e)}
        />

        {fileUrl && (
          <Image
            className="rounded mt-4"
            width="350"
            src={fileUrl}
            alt="Nft image"
            height="100%"
            layout="responsive"
            objectFit="contain"
          />
        )}

        <button
          onClick={listNFTForSale}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Create NFT
        </button>
      </div>
    </div>
  )
}