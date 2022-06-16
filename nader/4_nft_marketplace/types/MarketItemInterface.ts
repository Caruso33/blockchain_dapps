import { BigNumber } from "ethers"

interface MarketItemInterface {
  tokenId: BigNumber
  seller: string
  owner: string
  price: BigNumber
  sold: boolean
  burned: boolean
  prevOwners: string[]
}

export type { MarketItemInterface as default }
