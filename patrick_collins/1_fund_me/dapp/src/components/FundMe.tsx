import React, { useEffect, useState } from "react"
import deployment from "../utils/deployment.json"
import Spinner from "./Spinner.tsx"
import { useAccount, useNetwork, useProvider, useSigner } from "wagmi"
import { Contract, ethers } from "ethers"

export default function FundMe() {
  const [contract, setContract] = useState<Contract | null>(null)

  const [fundingBalance, setFundingBalance] = useState("")
  const [funders, setFunders] = useState([])
  const [funder, setFunder] = useState("")

  const [fundAmount, setFundAmount] = useState("")
  const [funderIndex, setFunderIndex] = useState("")

  const [isLoading, setIsLoading] = useState(false)

  const { isConnected } = useAccount()
  const { data: signer } = useSigner()
  const { chain } = useNetwork()
  const provider = useProvider()

  useEffect(() => {
    if (!signer || !chain?.id) {
      return
    }

    const address = deployment[chain?.id]?.address
    const abi = deployment[chain?.id]?.abi

    if (!address || !abi) {
      return
    }

    const contract = new ethers.Contract(address, abi, signer)
    setContract(contract)
  }, [chain, signer])

  async function getFundingBalance() {
    if (!contract || !provider) {
      return
    }

    setIsLoading(true)

    const balance = await provider.getBalance(contract.address)
    console.log("Balance: ", ethers.utils.formatEther(balance.toString()))
    setFundingBalance(ethers.utils.formatEther(balance.toString()))

    setIsLoading(false)

    return balance
  }

  async function getFunders() {
    if (!contract) {
      return
    }

    setIsLoading(true)
    try {
      const funders = await contract?.getFunders()
      console.log("Funders: ", funders)
      setFunders(funders)
    } finally {
      setIsLoading(false)
    }
  }

  async function getFunder() {
    if (!contract || !funderIndex || isNaN(+funderIndex)) {
      return
    }

    setIsLoading(true)
    try {
      const funder = await contract?.getFunder(+funderIndex)
      console.log("Funder: ", funder)
      setFunder(funder)
    } finally {
      setIsLoading(false)
    }
  }

  async function fund() {
    if (!contract || !fundAmount || isNaN(+fundAmount)) {
      return
    }

    setIsLoading(true)
    try {
      const amount = ethers.utils.parseEther(fundAmount)
      console.log(fundAmount, amount.toString())

      const tx = await contract?.fund({ value: amount })
      await tx.wait()
      console.log("Funded")
      getFundingBalance()
      getFunders()
    } finally {
      setIsLoading(false)
    }
  }

  async function withdraw() {
    if (!contract) {
      return
    }

    setIsLoading(true)
    try {
      const tx = await contract?.withdraw()
      await tx.wait()
      console.log("Withdrawn")
      getFundingBalance()
      getFunders()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    isConnected && (
      <div>
        <h1>FundMe</h1>
        <h2>Funding Balance</h2>
        <button onClick={getFundingBalance}>
          {isLoading ? <Spinner /> : "Get Funding Balance"}
        </button>
        <pre>{fundingBalance}</pre>
        <h2>Get funders</h2>
        <button onClick={getFunders}>
          {isLoading ? <Spinner /> : "Get funders"}
        </button>
        <pre>Funders: {funders.join(", ")}</pre>
        <h2>Get funder</h2>
        <input
          type="text"
          value={funderIndex}
          onChange={(e) => setFunderIndex(e.target.value)}
        />
        <button onClick={() => getFunder(fundAmount)}>
          {isLoading ? <Spinner /> : "Get funder"}
        </button>
        <pre>Funder: {funder}</pre>
        <h2>Fund</h2>
        <input
          type="number"
          placeholder="Type eth amount"
          value={fundAmount}
          onChange={(e) => setFundAmount(e.target.value)}
        />
        <button onClick={fund}>{isLoading ? <Spinner /> : "Fund"}</button>

        <h2>Withdraw</h2>
        <button onClick={withdraw}>
          {isLoading ? <Spinner /> : "Withdraw"}
        </button>
      </div>
    )
  )
}
