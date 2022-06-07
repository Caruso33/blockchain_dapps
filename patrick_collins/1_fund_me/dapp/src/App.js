import {
  chain,
  useAccount,
  useConnect,
  useNetwork,
  useBalance,
  useEnsName,
} from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
function App() {
  const { connect } = useConnect({
    connector: new InjectedConnector({
      // connector: new MetaMaskConnector({
      chains: [chain.localhost],
    }),
  })
  const network = useNetwork({
    chainId: 1337,
  })
  console.dir("network", network)

  const { data: account } = useAccount()
  console.dir("account", account)

  const { data: ensName } = useEnsName({ address: account?.address })
  console.log("ensName", ensName)

  const { data: balance } = useBalance({
    addressOrName: account?.address,
  })
  console.dir("balance", balance)

  console.log("value", balance?.value?.toString())

  if (account) return <div>Connected to {ensName ?? account?.address}</div>

  return <button onClick={() => connect()}>Connect Wallet</button>
}

export default App
