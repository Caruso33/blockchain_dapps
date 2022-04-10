import express from "express"
import Web3 from "web3"
import FlightSuretyApp from "../../build/contracts/FlightSuretyApp.json"
import Config from "./config.json"
import { registerOracles, onOracleRequest, onFlightStatusInfo } from "./utils"

const config = Config["localhost"]
const web3 = new Web3(
  new Web3.providers.WebsocketProvider(config.url.replace("http", "ws"))
)
web3.eth.defaultAccount = web3.eth.accounts[0]
const flightSuretyApp = new web3.eth.Contract(
  FlightSuretyApp.abi,
  config.appAddress
)

// Retrieving oracle accounts and storing them in variable oracleAccounts
let oracleAccounts = []
let oracleIndexes = {}
let totalOracles = 20
let oracleInitialIndex = 10

registerOracles(web3, flightSuretyApp, {
  oracleAccounts,
  oracleIndexes,
  totalOracles,
  oracleInitialIndex,
})

flightSuretyApp.events.OracleRequest({ fromBlock: 0 }, onOracleRequest)

// Listen to the 'FlightStatusInfo' event and console log the result
flightSuretyApp.events.FlightStatusInfo({ fromBlock: 0 }, onFlightStatusInfo)

const app = express()
app.get("/api", (req, res) => {
  res.send({
    message: "An API for use with your Dapp!",
  })
})

export default app
