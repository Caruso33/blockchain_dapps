import { ethers } from "ethers"
import { useEffect, useRef, useState } from "react"
import "./App.css"
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json"

const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

function App() {
  const [greeting, setGreetingValue] = useState("")

  const provider = useRef(null)
  const contract = useRef(null)

  useEffect(() => {
    if (typeof window.ethereum != "undefined") {
      provider.current = new ethers.providers.Web3Provider(window.ethereum)

      contract.current = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider.current
      )
    }
  }, [])

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" })
  }

  async function fetchGreeting() {
    if (!provider.current) return

    try {
      const data = await contract.current.greet()
      console.log("data: ", data)
    } catch (error) {
      console.log("error: ", error)
    }
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
      </header>
    </div>
  )
}

export default App
