import React, { useEffect, useState } from "react"
// import "./index.css"
import SelectCharacter from "../components/SelectCharacter"
// import twitterLogo from "/twitter-logo.svg"
import ContractArtifact from "../utils/ContractArtifact.json"
import { ethers } from "ethers"
import { CONTRACT_ADDRESS, transformCharacterData } from "../constants"

// Constants
const TWITTER_HANDLE = "caruso33"
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`

const App = () => {
  // State
  const [currentAccount, setCurrentAccount] = useState(null)
  const [characterNFT, setCharacterNFT] = useState(null)

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log("Make sure you have MetaMask!")
        return
      } else {
        console.log("We have the ethereum object", ethereum)

        const accounts = await ethereum.request({ method: "eth_accounts" })

        if (accounts.length !== 0) {
          const account = accounts[0]
          console.log("Found an authorized account:", account)
          setCurrentAccount(account)
        } else {
          console.log("No authorized account found")
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        alert("Get MetaMask!")
        return
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      })

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log("Connected", accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  useEffect(() => {
    /*
     * The function we will call that interacts with out smart contract
     */
    const fetchNFTMetadata = async () => {
      console.log("Checking for Character NFT on address:", currentAccount)

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ContractArtifact.abi,
        signer
      )

      const txn = await gameContract.checkIfUserHasNFT()
      if (txn.name) {
        console.log("User has character NFT")
        setCharacterNFT(transformCharacterData(txn))
      } else {
        console.log("No character NFT found")
      }
    }

    /*
     * We only want to run this, if we have a connected wallet
     */
    if (currentAccount) {
      console.log("CurrentAccount:", currentAccount)
      fetchNFTMetadata()
    }
  }, [currentAccount])

  // Render Methods
  const renderContent = () => {
    /*
     * Scenario #1
     */
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img src="https://i.imgur.com/lvlFhZY.jpeg" alt="web3" />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      )
      /*
       * Scenario #2
       */
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />
    }
  }

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">🌐 Web3 to the win! 🌐️</p>

          <p className="sub-text">Team up to protect the Metaverse!</p>
          <div className="connect-wallet-container">Ï{renderContent()}</div>
        </div>
        <div className="footer-container">
          {/* <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} /> */}
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  )
}

export default App
