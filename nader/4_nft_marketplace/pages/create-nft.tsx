import multiavatar from "@multiavatar/multiavatar"
import { ethers, providers } from "ethers"
import { create as ipfsHttpClient } from "ipfs-http-client"
import Image from "next/image"
import { useRouter } from "next/router"
import { ChangeEvent, useState } from "react"
import saveSvgAsPng from "save-svg-as-png"
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"
import {
  contractArtifact,
  contractAddresses,
} from "../constants/hardhat-helper"
import Spinner from "../components/Spinner"
import { getWeb3Connection } from "../components/web3/utils"

const client = ipfsHttpClient({ url: "https://ipfs.infura.io:5001/api/v0" })

export default function CreateItem() {
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  })
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [fileSvgPath, setFileSvgPath] = useState<string | null>(null)

  const [isImageUploading, setIsImageUploading] = useState<boolean>(false)
  const [isMetaUploading, setIsMetaUploading] = useState<boolean>(false)
  const [isCreatingItem, setIsCreatingItem] = useState<boolean>(false)

  const isLoading = isImageUploading || isMetaUploading || isCreatingItem

  const router = useRouter()

  async function uploadFileToIpfs(file: File) {
    let url = ""

    setIsImageUploading(true)

    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      })

      url = `https://ipfs.infura.io/ipfs/${added.path}`
    } catch (error) {
      console.log("Error uploading file: ", error)
    } finally {
      setIsImageUploading(false)
    }

    return url
  }

  async function onChangeInputFile(file: File) {
    if (!file) return

    const url = await uploadFileToIpfs(file)

    setFileSvgPath(null)
    setFileUrl(url)
  }

  async function onChangeAvatarInput(e: ChangeEvent<HTMLInputElement>) {
    const svgPath = multiavatar(e.target.value)

    setFileUrl(null)
    setFileSvgPath(svgPath)
  }

  async function svgPathToFile(svgPath: string) {
    const container = document.getElementById("svg-container")

    if (!container) return

    container.innerHTML = svgPath

    try {
      const dataUri = await saveSvgAsPng.svgAsDataUri(
        document.getElementsByTagName("svg")[0]
      )

      const svgFile = await fetch(dataUri)
        .then(function (res) {
          return res.arrayBuffer()
        })
        .then(function (buf) {
          return new File([buf], formInput?.name || "Avatar", {
            type: "image/svg+xml",
          })
        })

      return svgFile
    } catch (error) {
      console.error("Error creating file from Svg: ", error)
    }
  }

  async function uploadToIPFS() {
    const { name, description, price } = formInput
    if (!name || !description || !price || (!fileUrl && !fileSvgPath)) {
      console.error("Please fill all inputs")
      console.log(!name, !description, !price, !fileUrl, !fileSvgPath)
      return
    }

    let imageUrl = fileUrl
    if (fileSvgPath && !fileUrl) {
      const fileSvg = await svgPathToFile(fileSvgPath)

      if (!fileSvg) return
      imageUrl = await uploadFileToIpfs(fileSvg)
    }

    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: imageUrl,
    })

    setIsMetaUploading(true)
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url
    } catch (error) {
      console.log("Error uploading file: ", error)
    } finally {
      setIsMetaUploading(false)
    }
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS()
    if (!url) return

    console.log({ url })

    const { network, signer } = await getWeb3Connection()

    /* next, create the item */
    const price = ethers.utils.parseUnits(formInput.price, "ether")
    const contract = new ethers.Contract(
      contractAddresses[network.chainId],
      contractArtifact.abi,
      signer
    )

    try {
      setIsCreatingItem(true)
      let listingPrice = await contract.getListingPrice()
      listingPrice = listingPrice.toString()
      const transaction = await contract.createToken(url, price, {
        value: listingPrice,
      })
      await transaction.wait()

      router.push("/")
    } catch (e) {
      console.error(e)
    } finally {
      setIsCreatingItem(false)
    }
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

        <div className="flex flex-col justify-between my-4">
          <p className="text-xl font-bold">Image</p>

          <input
            type="file"
            name="Asset"
            className="file:rounded-full file:border-0 file:bg-pink-300 hover:file:bg-pink-400 file:text-white file:px-2 file:my-2"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const file = e?.target?.files?.[0]
              if (!file) return
              onChangeInputFile(file)
            }}
            disabled={isLoading}
          />

          <p className="text-xl py-2">OR autogenerate Multiavatar</p>

          <input
            type="text"
            name="Asset"
            className="border rounded"
            onChange={(e) => onChangeAvatarInput(e)}
            disabled={isLoading}
          />
        </div>

        {isLoading && !fileUrl && !fileSvgPath && <Spinner />}

        <div
          className="flex justify-center my-2"
          style={{ height: "100%", width: "100%" }}
        >
          {fileUrl && (
            <div
              className="text-center mt-4"
              style={{ height: "100%", width: 350 }}
            >
              <Image
                className="rounded mt-4"
                width="100%"
                src={fileUrl}
                alt="Nft image"
                height="100%"
                layout="responsive"
                objectFit="contain"
                crossOrigin="anonymous"
                unoptimized={true}
              />
            </div>
          )}

          <div
            id="svg-container"
            className="flex justify-center mt-4"
            style={{
              height: "100%",
              width: 350,
              // TODO: Improve the following, it's a bit ugly
              visibility: fileSvgPath ? "visible" : "hidden",
              position: fileSvgPath ? "inherit" : "absolute",
            }}
            dangerouslySetInnerHTML={{ __html: fileSvgPath as string }}
          />
        </div>

        <button
          onClick={listNFTForSale}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : "Create NFT"}
        </button>

        {isCreatingItem && (
          <p className="text-xl text-center my-4">
            {"Creating Item on Blockchain"}
            <br />
            <br />
            {
              "This can take some minutes, please hang on. We're waiting also for the transaction confirmation."
            }
          </p>
        )}
      </div>
    </div>
  )
}
