import React from "react"
import ReactDOM from "react-dom/client"
import {
  chain,
  configureChains,
  createClient,
  defaultChains,
  WagmiConfig,
} from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
// import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
import App from "./App"
import reportWebVitals from "./reportWebVitals"



// const alchemyPolygon = process.env.REACT_APP_POLYGON_MAIN
// const alchemyPolygonMumbai = process.env.REACT_APP_POLYGON_MUMBAI

const { chains, provider } = configureChains(
  [...defaultChains, chain.hardhat, chain.polygon, chain.polygonMumbai],
  [
    // alchemyProvider({ alchemyId: alchemyPolygonMumbai }),
    // alchemyProvider({ alchemyId: alchemyPolygon }),
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
