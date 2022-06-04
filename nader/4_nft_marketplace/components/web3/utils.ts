import { ethers } from "ethers"
import Web3Modal from "web3modal"

interface Web3Connection {
  provider: ethers.providers.Web3Provider
  signer: ethers.Signer
}

async function getWeb3Connection(): Promise<Web3Connection> {
  const web3Modal = new Web3Modal()
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()

  return {
    provider,
    signer,
  }
}

export { getWeb3Connection, type Web3Connection }
