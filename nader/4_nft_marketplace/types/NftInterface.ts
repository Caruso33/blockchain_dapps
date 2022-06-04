import { BigNumber } from "ethers"

interface NftInterface {
  tokenId: BigNumber
  tokenUri: string
  price: BigNumber
  seller: string
  owner: string
}

interface NftData {
  tokenId: number
  tokenUri: string
  price: string
  seller: string
  owner: string
  image?: string
}

export type { NftInterface as default, NftData }
