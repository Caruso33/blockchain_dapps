# Raffle Lottery Contract

## Deployed to

### Smart contract

[Rinkeby etherscan](0x56dD898f846b5aeB93C754481E58Bb2661567dED](https://rinkeby.etherscan.io/address/0x56dD898f846b5aeB93C754481E58Bb2661567dED)

### Frontend

#### IPFS CIDs

QmaSCQVsNg5UPQchy8oeHCvuSa5GHNbcLT97c75DKwFdGF out - folder
QmUNm1jDvcgrpuKhccysUrKCTJXFJ6ucYRf9mUeEG7yGNN out/index.html

(Browser friendly base32 encoded CID:
`ipfs cid base32 QmaSCQVsNg5UPQchy8oeHCvuSa5GHNbcLT97c75DKwFdGF`)

[IPFS web hosted](https://ipfs.io/ipfs/QmaSCQVsNg5UPQchy8oeHCvuSa5GHNbcLT97c75DKwFdGF)

#### Vercel

[Vercel deployment](https://raffle-lottery-dapp.vercel.app/)

## Install

`yarn`

`cd frontend && yarn`

## Run locally

`yarn run node` - run hardhat node

`cd frontend && yarn dev` - run nextjs frontend

## Build frontend

`cd frontend && yarn build` - build frontend

`cd frontend && yarn next export` - export frontend into `out` folder

## Deploy

`yarn run deploy --network rinkeby`

`cd frontend && ipfs add -r out` - add frontend to IPFS

\_OR\_

`cd frontend/out && yarn vercel --prod $(pwd)` - deploy frontend to Vercel
