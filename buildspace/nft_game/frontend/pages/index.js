import React, { useEffect } from "react"
import twitterLogo from "../assets/twitter-logo.svg"
import Image from "next/image"

// Constants
const TWITTER_HANDLE = "_buildspace"
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`

const App = () => {
  /*
   * Start by creating a new action that we will run on component load
   */
  // Actions
  const checkIfWalletIsConnected = () => {
    /*
     * First make sure we have access to window.ethereum
     */
    const { ethereum } = window

    if (!ethereum) {
      console.log("Make sure you have MetaMask!")
      return
    } else {
      console.log("We have the ethereum object", ethereum)
    }
  }

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
        </div>
        <div className="connect-wallet-container">
          <img
            src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
            alt="Monty Python Gif"
          />
        </div>
        <div className="footer-container">
          <Image
            src={twitterLogo}
            className="twitter-logo"
            alt="Twitter Logo"
            height={35}
            width={35}
          />

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
