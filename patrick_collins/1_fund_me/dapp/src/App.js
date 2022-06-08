import { ethers } from "ethers"
import { useAccount, useConnect, useNetwork, useBalance } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"

function App() {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const network = useNetwork()

  const { data: account } = useAccount()

  const { data: balance } = useBalance({
    addressOrName: account?.address,
  })
  const balanceString = ethers.utils
    .formatEther(balance?.value?.toString(), "ether")
    .toString()

  if (account)
    return (
      <div>
        Connected to {account?.address} on {network?.activeChain?.name}
        <br />
        Balance: {balanceString}
      </div>
    )

  return <button onClick={() => connect()}>Connect Wallet</button>
}

export default App
