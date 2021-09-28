import React, { useEffect, useState } from "react"
import "./App.css"
import lottery from "./lottery"
import web3 from "./web3"

export default function App() {
  const [manager, setManager] = useState("")
  const [players, setPlayers] = useState([])
  const [balance, setBalance] = useState("")
  const [message, setMessage] = useState("")
  const [value, setValue] = useState("")

  useEffect(async () => {
    const manager = await lottery.methods.manager().call()
    const players = await lottery.methods.getPlayers().call()
    const balance = await web3.eth.getBalance(lottery.options.address)

    setManager(manager)
    setPlayers(players)
    setBalance(balance)
  }, [])

  async function onEnterSubmit(event) {
    event.preventDefault()

    const floatValue = parseFloat(value)
    if (isNaN(floatValue) || floatValue <= 0) {
      console.error("Value must be a number and greater than zero.")
      return
    }

    await web3.eth.requestAccounts().catch(() => {})

    const accounts = await web3.eth.getAccounts()
    if (accounts.length === 0) {
      console.error(
        "No accounts found, please use and allow access to Metamask."
      )
      return
    }
    setMessage("Waiting on transaction success...")

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value),
    })

    setMessage("You have been entered!")
    setValue(value)
  }

  const onPickWinner = async (event) => {
    event.preventDefault()

    setMessage("Waiting on transaction success...")

    await web3.eth.requestAccounts().catch(() => {})

    const accounts = await web3.eth.getAccounts()
    if (accounts.length === 0) {
      console.error(
        "No accounts found, please use and allow access to Metamask."
      )
      return
    }

    await lottery.methods.pickWinner().send({ from: accounts[0] })

    setMessage("A winner has been picked!")
  }

  return (
    <>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {manager}.
        <br />
        There are currently {players.length} people entered, competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether!
      </p>

      <hr />

      <form onSubmit={onEnterSubmit} action="">
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            onChange={(event) => setValue(event.target.value)}
            type="number"
            step="0.001"
          />
          <button>Enter</button>
        </div>
      </form>

      <hr />

      <h4>Ready to pick a winner?</h4>
      <button onClick={onPickWinner}>Pick a winner!</button>
      <hr />
      <h1>{message}</h1>
    </>
  )
}
