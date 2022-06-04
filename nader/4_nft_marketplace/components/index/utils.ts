import axios from "axios"
import { Contract, ethers } from "ethers"
import NftInterface, { NftData } from "../../types/NftInterface"

async function getNftData(nft: NftInterface, contract: Contract) {
  const price = ethers.utils.formatUnits(nft.price.toString(), "ether")

  const item: NftData = {
    tokenId: nft.tokenId.toNumber(),
    tokenUri: nft.tokenUri,
    price,
    seller: nft.seller,
    owner: nft.owner,
  }

  try {
    const tokenUri = await contract.tokenURI(nft.tokenId)
    const meta = await axios.get(tokenUri)
    item.image = meta.data.image
  } catch (e) {
    console.error(e.message)
  }
  return item
}

export { getNftData }
