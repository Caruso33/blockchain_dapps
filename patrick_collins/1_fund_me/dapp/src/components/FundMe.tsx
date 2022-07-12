import React, { useState } from "react"
import deployment from "../utils/deployment.json"
import Spinner from "./Spinner.tsx"
import { useAccount, useSigner } from "wagmi"
import { ethers } from "ethers"

export default function FundMe() {
  const [funders, setFunders] = useState([])
  const [fundAmount, setFundAmount] = useState("")
  const [version, setVersion] = useState("")

  const [isLoading, setIsLoading] = useState(false)

  const { isConnected } = useAccount()
  const { data: signer } = useSigner()

  const fundMe = signer
    ? new ethers.Contract(deployment.address, deployment.abi, signer)
    : null

  async function getFunders() {
    setIsLoading(true)
    try {
      const funders = await fundMe?.getFunders()
      console.log("Funders: ", funders)
      setFunders(funders)
    } finally {
      setIsLoading(false)
    }
  }

  async function fund() {
    setIsLoading(true)
    try {
      const amount = ethers.utils.parseEther(fundAmount)
      console.dir(fundAmount, amount.toString())

      const tx = await fundMe?.fund({ value: amount })
      await tx.wait()
    } finally {
      setIsLoading(false)
    }
  }

  //   async function getVersion() {
  //     setIsLoading(true)
  //     try {
  //       const version = await fundMe?.getVersion()
  //       console.log("Version: ", version)
  //       setVersion(version)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }

  async function withdraw() {
    setIsLoading(true)
    try {
      const tx = await fundMe?.withdraw()
      await tx.wait()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    isConnected && (
      <div>
        <h2>Get funders</h2>
        <button onClick={getFunders}>
          {isLoading ? <Spinner /> : "Get funders"}
        </button>
        <pre>Funders: {funders.join(", ")}</pre>
        <h2>Fund</h2>
        <input
          type="number"
          placeholder="Type eth amount"
          value={fundAmount}
          onChange={(e) => setFundAmount(e.target.value)}
        />
        <button onClick={fund}>
          {isLoading ? <Spinner /> : "Save storage"}
        </button>
        {/* <h2>Get Version</h2>
        <button onClick={getVersion}>
          {isLoading ? <Spinner /> : "Get Version"}
        </button>
        <pre>Version: {version}</pre> */}
        <h2>Withdraw</h2>
        <button onClick={withdraw}>
          {isLoading ? <Spinner /> : "Withdraw"}
        </button>
      </div>
    )
  )
}
