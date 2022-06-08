import { chain, useAccount, useConnect, useNetwork, useBalance } from "wagmi"

function App() {
  const { connect } = useConnect()
  const network = useNetwork()
  console.dir("network", network)

  const { data: account } = useAccount()
  console.dir("account", account)

  const { data: balance } = useBalance({
    addressOrName: account?.address,
  })
  console.dir("balance", balance)

  console.log("value", balance?.value?.toString())

  if (account) return <div>Connected to {account?.address}</div>

  return <button onClick={() => connect()}>Connect Wallet</button>
}

export default App
