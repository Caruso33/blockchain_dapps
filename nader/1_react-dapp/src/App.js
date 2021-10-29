import { ethers } from "ethers"
import { useEffect, useRef, useState } from "react"
import "./App.css"
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json"
import Token from "./artifacts/contracts/Token.sol/Token.json"

const greeterAddress = "0x2e590d65Dd357a7565EfB5ffB329F8465F18c494" // ropsten address
// "0x5FbDB2315678afecb367f032d93F642f64180aa3" // local address

const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" // local address

function App() {
  const [account, setAccount] = useState("")
  const [greeting, setGreetingValue] = useState("")
  const [userAccount, setUserAccount] = useState("")
  const [amount, setAmount] = useState(0)

  const provider = useRef(null)

  useEffect(() => {
    if (typeof window.ethereum != "undefined") {
      provider.current = new ethers.providers.Web3Provider(window.ethereum)
    }
  }, [])

  async function requestAccount() {
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    setAccount(account)
  }

  async function fetchGreeting() {
    if (!provider.current) return

    try {
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider.current
      )
      const data = await contract.greet()
      console.log("data: ", data)
    } catch (error) {
      console.log("error: ", error)
    }
  }

  async function sendCoins() {
    if (!provider.current) return

    await requestAccount()

    const signer = provider.current.getSigner()

    const contract = new ethers.Contract(tokenAddress, Token.abi, signer)
    const transaction = await contract.transfer(userAccount, amount)

    await transaction.wait()

    console.log(`${amount} Coins successfully sent to ${userAccount}`)
  }

  async function setGreeting() {
    if (!greeting) return
    if (!provider.current) return

    await requestAccount()

    const signer = provider.current.getSigner()

    const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
    const transaction = await contract.setGreeting(greeting)
    setGreetingValue("")

    await transaction.wait()

    fetchGreeting()
  }

  async function getBalance() {
    if (!provider.current) return

    await requestAccount()
    const contract = new ethers.Contract(
      tokenAddress,
      Token.abi,
      provider.current
    )
    const balance = await contract.balanceOf(account)
    console.log(`Balance: ${balance.toString()} C33T`)
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input
          onChange={(e) => setGreetingValue(e.target.value)}
          placeholder="Set greeting"
          value={greeting}
        />

        <br />

        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input
          onChange={(e) => setUserAccount(e.target.value)}
          placeholder="Account ID"
          value={userAccount}
        />
        <input
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          value={amount}
        />
      </header>
    </div>
  )
}

export default App
