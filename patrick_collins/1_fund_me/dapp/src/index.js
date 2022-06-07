import { providers } from "ethers"
import React from "react"
import ReactDOM from "react-dom/client"
import { chain, createClient, WagmiConfig } from "wagmi"
import App from "./App"
import reportWebVitals from "./reportWebVitals"

const client = createClient({
  autoConnect: true,
  provider({ chainId }) {
    // Use JsonRpcProvider for localhost
    console.log("chainId", chainId)
    console.log("localhost.id", chain.localhost.id)

    if (chainId === 1337 || chainId === 31337 || chainId === chain.localhost.id)
      return new providers.JsonRpcProvider()

    return new providers.AlchemyProvider(chainId)
  },
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
