import { providers } from "ethers"
import React from "react"
import ReactDOM from "react-dom/client"
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
  defaultChains,
} from "wagmi"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
import { InjectedConnector } from "wagmi/connectors/injected"

const { chains, provider } = configureChains(
  [...defaultChains, chain.hardhat],
  [
    alchemyProvider({ alchemyId: process.env.POLYGON_MUMBAI }),
    publicProvider(),
  ]
)

const client = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  provider,
})

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <App />
    </WagmiConfig>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
