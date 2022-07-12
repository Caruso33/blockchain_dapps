import React from "react"
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { deployedChains } from "../utils/constants.ts"

function Header() {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  let content: JSX.Element

  if (!isConnected)
    content = <button onClick={() => connect()}>Connect Wallet</button>
  else {
    content = (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <span>Connected to {address}</span>{" "}
          <span>on network {chain?.name}</span>
        </div>

        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    )

    const deployedChainNames = deployedChains.map(
      (deployedChain) => deployedChain.name
    )

    if (!deployedChainNames?.includes(chain?.name)) {
      return (
        <>
          {content}
          <div>Please connect to {deployedChainNames[0]} chain</div>
        </>
      )
    }
  }

  return content
}

export default Header
