import axios from "axios"
import { Contract, ethers } from "ethers"
import NftInterface, { NftData } from "../../types/NftInterface"

async function getNftData(nft: NftInterface, contract: Contract) {
  const price = ethers.utils.formatUnits(nft.price.toString(), "ether")

  const item: NftData = {
    tokenId: nft.tokenId.toNumber(),
    tokenURI: nft.tokenURI,
    price,
    seller: nft.seller,
    owner: nft.owner,
  }

  try {
    const tokenURI = await contract.tokenURI(nft.tokenId)
    const meta = await axios.get(tokenURI)

    item.image = meta.data?.image
    item.name = meta.data?.name
    item.description = meta.data?.description
  } catch (e: any) {
    console.error(e.message)
  }
  return item
}

export { getNftData }
