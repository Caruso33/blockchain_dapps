import { contract } from "./index"

export {
  getPastAppLogs,
  getPastDataLogs,
  getAllAppEvents,
  getAllDataEvents,
  onAuthorizeAppContract,
  getDataContractStatus,
  setDataContractStatus,
  getAirlines,
  registerNewAirlines,
}

function onPastEvent(eventLog) {
  $("#past-log-events").append("<li>" + eventLog + "</li>")
}
function onEvent(eventLog) {
  $("#log-events").append("<li>" + eventLog + "</li>")
}

function getPastAppLogs() {
  contract.flightSuretyApp
    .getPastEvents("allEvents", { fromBlock: 0 })
    .then((events) => {
      for (const event of events) {
        console.log(
          `flightSuretyApp.getPastEvents error: ${error}, event:  ${event}`
        )
        onPastEvent(`${event.event}: ${event.args}`)
      }
    })
}

function getPastDataLogs() {
  contract.flightSuretyData
    .getPastEvents("allEvents", { fromBlock: 0 })
    .then((events) => {
      console.log({ events })
      for (const event of events) {
        console.log(
          `flightSuretyData.getPastEvents error: ${error}, event:  ${event}`
        )
        onPastEvent(`${event.event}: ${event.args}`)
      }
    })
}

function getAllAppEvents() {
  contract.flightSuretyApp.events.allEvents((error, event) => {
    console.log(
      `flightSuretyApp.getAllAppEvents error: ${error}, event:  ${event}`
    )
    onEvent(`${event.event}: ${event.args}`)
  })
}

function getAllDataEvents() {
  contract.flightSuretyApp.events.allEvents((error, event) => {
    console.log(
      `flightSuretyData.getAllDataEvents error: ${error}, event:  ${event}`
    )
    onEvent(`${event.event}: ${event.args}`)
  })
}

function onAuthorizeAppContract() {
  contract.flightSuretyData.methods
    .authorizeCaller(contract.flightSuretyAppAddress)
    .send({ from: contract.owner }, (error, result) => {
      if (error) {
        console.log(error)
        return
      }

      console.log("App address is authorized")
    })
}

function getDataContractStatus() {
  return new Promise((resolve, reject) => {
    contract.flightSuretyData.methods.isOperational().call((error, result) => {
      if (error) {
        console.error(error)
        return reject(error)
      }

      console.log(`Data contract is ${!result ? "not " : ""}operational`)

      resolve(result)
    })
  })
}

function setDataContractStatus(mode) {
  console.log({ mode })

  return new Promise((resolve, reject) => {
    contract.flightSuretyData.methods
      .setOperatingStatus(mode)
      .call((error, result) => {
        if (error) {
          console.error(error)
          return reject(error)
        }

        console.log(
          `Data contract is now set ${!mode ? "not " : ""}operational`
        )

        resolve(result)
      })
  })
}

function getAirlines() {
  return new Promise((resolve, reject) => {
    contract.flightSuretyData.methods.getAirlines().call((error, result) => {
      if (error) {
        console.error(error)
        return reject(error)
      }

      const [airlineAddresses, airlineNames] = [result[0], result[1]]

      console.log(
        `Airlines addresses: ${airlineAddresses}, airline names: ${airlineNames}`
      )

      resolve(result)
    })
  })
}

function registerNewAirlines(airlineName, airlineAdress) {
  if (airlineAdress === "Airline") {
    return alert("Please select correct airline")
  }

  return new Promise((resolve, reject) => {
    contract.flightSuretyApp.methods
      .createAirline(airlineName, airlineAdress)
      .send({ from: contract.owner }, (error, result) => {
        if (error) {
          console.error(error)
          return reject(error)
        }

        console.log(`Airline registered: ${result}`)

        resolve(result)
      })
  })
}
