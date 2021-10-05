import Web3 from "web3"

let web3 = null

if (typeof window !== "undefined" && window.ethereum) {
  console.log("metamask")

  // browser environment and metamask
  web3 = new Web3(ethereum)
} else if (typeof window !== "undefined" && window.web3.currentProvider) {
  console.log("old metamask")

  // browser environment and old metamask
  web3 = new Web3(window.web3.currentProvider)
} else {
  // we are on the server
  console.log("server")

  // create own provider through infura.io
  const provider = new Web3.providers.HttpProvider(
    process.env.NEXT_PUBLIC_NETWORK
  )
  web3 = new Web3(provider)
}

export { web3 as default }
