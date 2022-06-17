import type { AppProps } from "next/app"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { getWeb3Connection } from "../components/web3/utils"
import "../styles/globals.css"

function MyApp({ Component, pageProps }: AppProps) {
  const [chainId, setChainId] = useState<number | null>()

  const setNewChainId = useCallback((chainId: number) => {
    console.log("Chain changed to: ", chainId)
    // metamask has currently a bug so the user has to refresh the page manually when the chain
    // is not set to polygons mumbai network initially
    // https://github.com/MetaMask/metamask-mobile/issues/2927
    setChainId(chainId)
  }, [])

  useEffect(() => {
    async function checkConnectedNetwork() {
      try {
        const { provider } = await getWeb3Connection()
        const network = await provider.getNetwork()

        if (provider?.on) provider.on("chainChanged", setNewChainId)
        else console.log("no handler")

        setChainId(network.chainId)
      } catch (error) {
        console.error(error)
        setChainId(0)
      }
    }

    checkConnectedNetwork()
  }, [setNewChainId])

  let networkContent = (
    <div className="flex justify-center">
      <div className="p-4" style={{ maxWidth: "1600px" }}>
        <p className="text-lg font-bold text-center">
          {`Wrong network set.`}
          <br />
          <br />
          {
            "Please change your wallet to Polygon's Mumbai network as explained here and please refresh the page:"
          }
          <br />
          {
            "https://medium.com/stakingbits/how-to-connect-polygon-mumbai-testnet-to-metamask-fc3487a3871f"
          }
        </p>
      </div>
    </div>
  )

  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold tracking-widest">
          Avatar NFT Marketplace
        </p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-6 text-pink-500">Home</a>
          </Link>

          <Link href="/create-nft">
            <a className="mr-6 text-pink-500">Sell Digital Asset</a>
          </Link>

          <Link href="/my-nfts">
            <a className="mr-6 text-pink-500">My Digital Assets</a>
          </Link>

          <Link href="/dashboard">
            <a className="mr-6 text-pink-500">Creator Dashboard</a>
          </Link>
        </div>
      </nav>

      {chainId &&
      chainId !== Number(process.env.NEXT_PUBLIC_DEPLOYED_CHAINID) ? (
        networkContent
      ) : (
        <Component {...pageProps} />
      )}
    </div>
  )
}

export default MyApp
