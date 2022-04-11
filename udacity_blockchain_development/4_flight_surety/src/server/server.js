import express from "express"
import Web3 from "web3"
import FlightSuretyApp from "../../build/contracts/FlightSuretyApp.json"
import FlightSuretyData from "../../build/contracts/FlightSuretyData.json"
import Config from "./config.json"
import {
  getAccounts,
  registerOracles,
  getOracleIndexes,
  onOracleRequest,
  onFlightStatusInfo,
} from "./utils"

function run_app() {
  const config = Config["localhost"]
  const web3 = new Web3(
    new Web3.providers.WebsocketProvider(config.url.replace("http", "ws"))
  )
  web3.eth.defaultAccount = web3.eth.accounts[0]
  const flightSuretyData = new web3.eth.Contract(
    FlightSuretyData.abi,
    config.appAddress
  )
  const flightSuretyApp = new web3.eth.Contract(
    FlightSuretyApp.abi,
    config.appAddress
  )

  // Retrieving oracle accounts and storing them in variable oracleAccounts
  const totalOracles = 10
  const oracleInitialIndex = 1

  let accounts = []
  let oraclesAddresses = []
  let indexes = []

  getAccounts(web3, oracleInitialIndex)
    .then((oracleAccounts) => {
      accounts = oracleAccounts

      return registerOracles(flightSuretyApp, accounts, totalOracles)
    })
    .then((registeredOracles) => {
      oraclesAddresses = registeredOracles

      return getOracleIndexes(flightSuretyApp, totalOracles, accounts)
    })
    .then((oracleIndexes) => {
      indexes = oracleIndexes

      console.log("Oracle Indexes: ", indexes)
    })
    .catch((e) => console.log(e.message))

  // flightSuretyData.event.on("change", (error, result) => {
  //   if (error) {
  //     console.log("change: ", error.message)
  //     return
  //   }

  //   console.log("change: ", result)
  // })

  flightSuretyApp.events.OracleRequest({ fromBlock: 0 }, (error, event) =>
    onOracleRequest(error, event, flightSuretyApp, accounts, indexes)
  )

  flightSuretyApp.events.FlightStatusInfo({ fromBlock: 0 }, onFlightStatusInfo)

  const app = express()
  app.get("/api", (req, res) => {
    res.send({
      message: "An API for use with your Dapp!",
    })
  })

  return app
}

const app = run_app()

export default app
