import { BigNumber } from "ethers"

interface NftInterface {
  tokenId: BigNumber
  tokenURI: string
  price: BigNumber
  seller: string
  owner: string
}

interface NftData {
  tokenId: number
  tokenURI: string
  price: string
  seller: string
  owner: string
  image?: string
  name?: string
  description?: string
}

export type { NftInterface as default, NftData }
