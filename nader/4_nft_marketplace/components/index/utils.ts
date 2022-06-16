import axios from "axios"
import { Contract, ethers } from "ethers"
import MarketItemInterface from "../../types/MarketItemInterface"
import NftInterface from "../../types/NftInterface"

async function getNftData(nft: MarketItemInterface, contract: Contract) {
  const price = ethers.utils.formatUnits(nft.price.toString(), "ether")

  const item: NftInterface = {
    tokenId: nft.tokenId,
    price,
    seller: nft.seller,
    owner: nft.owner,
  }

  try {
    const tokenURI = await contract.tokenURI(item.tokenId.toNumber())
    const meta = await axios.get(tokenURI)

    item.tokenURI = tokenURI
    item.image = meta.data?.image
    item.name = meta.data?.name
    item.description = meta.data?.description
  } catch (e: any) {
    console.error(e.message)
  }
  return item
}

export { getNftData }
