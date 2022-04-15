import { contract } from "./index"

export {
  getPastAppLogs,
  getPastDataLogs,
  getAllAppEvents,
  getAllDataEvents,
  onAuthorizeAppContract,
  getDataContractStatus,
  setDataContractStatus,
}

function getPastAppLogs() {
  contract.flightSuretyApp
    .getPastEvents("allEvents", { fromBlock: 0 })
    .then((events) => {
      for (const event of events) {
        console.log(
          `flightSuretyApp.getPastEvents error: ${error}, event:  ${event}`
        )
      }
    })
}
function getPastDataLogs() {
  contract.flightSuretyData
    .getPastEvents("allEvents", { fromBlock: 0 })
    .then((events) => {
      for (const event of events) {
        console.log(
          `flightSuretyData.getPastEvents error: ${error}, event:  ${event}`
        )
      }
    })
}

function getAllAppEvents() {
  contract.flightSuretyApp.events.allEvents().then((events) => {
    for (const event of events) {
      console.log(
        `flightSuretyApp.getAllAppEvents error: ${error}, event:  ${event}`
      )
    }
  })
}

function getAllDataEvents() {
  contract.flightSuretyApp.events.allEvents().then((events) => {
    for (const event of events) {
      console.log(
        `flightSuretyData.getAllDataEvents error: ${error}, event:  ${event}`
      )
    }
  })
}

function onAuthorizeAppContract() {
  contract.flightSuretyData.methods
    .authorizeCaller(contract.flightSuretyAppAddress)
    .send({ from: contract.owner }, (error, _result) => {
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
