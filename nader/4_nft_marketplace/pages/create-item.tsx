import { ethers } from "ethers"
import { create as ipfsHttpClient } from "ipfs-http-client"
import { useRouter } from "next/router"
import { useState } from "react"
import Web3Modal from "web3modal"
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"
import { nftMarketAddress } from "../config"
import Image from "next/image"

const ipfsClient = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0")

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, setFormInput] = useState({
    price: "",
    name: "",
    description: "",
  })

  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]

    try {
      const added = await ipfsClient.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      })
      const url = `https://ipfs.infura.io/ipfs/${added.path}`

      setFileUrl(url)
    } catch (error) {
      console.error(error)
    }
  }

  async function createItem() {
    const { name, description, price } = formInput
    if (!name || !description || !price) return

    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    })

    try {
      const added = await ipfsClient.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`

      createSale(url)
    } catch (error) {
      console.error(error)
    }
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    let contract = new ethers.Contract(nftAddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()

    console.log({ tx })
    const tokenId = tx.events[0].args[2].toNumber()

    const price = ethers.utils.parseUnits(formInput.price, "ether")

    contract = new ethers.Contract(nftMarketAddress, NFTMarket.abi, signer)

    const listingPrice = await contract.getListingPrice()

    transaction = await contract.createMarketItem(nftAddress, tokenId, price, {
      value: listingPrice.toString(),
    })
    await transaction.wait()

    router.push("/")
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={(e) => setFormInput({ ...formInput, name: e.target.value })}
        />

        <textarea
          placeholder="Asset Description"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            setFormInput({ ...formInput, description: e.target.value })
          }
        />

        <input
          placeholder="Asset Price"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            setFormInput({ ...formInput, price: e.target.value })
          }
          type="number"
          min={0}
        />

        <input className="my-4" name="Asset" onChange={onChange} type="file" />

        {fileUrl && (
          <Image
            width={350}
            height={350}
            className="rounded mt-4"
            src={fileUrl}
            alt="Asset Image"
          />
        )}

        <button
          onClick={createItem}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Create Digital Asset
        </button>
      </div>
    </div>
  )
}
