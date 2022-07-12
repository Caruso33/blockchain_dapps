import React, { useEffect, useState } from "react"
import deployment from "../utils/deployment.json"
import Spinner from "./Spinner.tsx"
import { useAccount, useNetwork, useSigner } from "wagmi"
import { Contract, ethers } from "ethers"

export default function FundMe() {
  const [contract, setContract] = useState<Contract | null>(null)

  const [funders, setFunders] = useState([])
  const [fundAmount, setFundAmount] = useState("")
  const [version, setVersion] = useState("")

  const [isLoading, setIsLoading] = useState(false)

  const { isConnected } = useAccount()
  const { data: signer } = useSigner()
  const { chain } = useNetwork()

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
