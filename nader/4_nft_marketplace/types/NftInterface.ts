import { BigNumber } from "ethers"

interface NftInterface {
  tokenId: BigNumber
  price: BigNumber | string
  seller: string
  owner: string
  tokenURI?: string
  image?: string
  name?: string
  description?: string
}

export type { NftInterface as default }
