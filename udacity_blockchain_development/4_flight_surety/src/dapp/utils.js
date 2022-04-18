import { contract } from "./index"
import { onPastEvent, onEvent } from "./ui"
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

function getPastAppLogs() {
  contract.flightSuretyApp
    .getPastEvents("allEvents", { fromBlock: 0 })
    .then((events) => {
      for (const event of events.reverse()) {
        const returnValues = JSON.stringify(event.returnValues)
        const msg = `${event.event}: ${returnValues}`

        console.log(`flightSuretyApp.getPastEvents event: ${msg}`)
        onPastEvent(msg)
      }
    })
}

function getPastDataLogs() {
  contract.flightSuretyData
    .getPastEvents("allEvents", { fromBlock: 0 })
    .then((events) => {
      for (const event of events.reverse()) {
        const returnValues = JSON.stringify(event.returnValues)
        const msg = `${event.event}: ${returnValues}`

        console.log(`flightSuretyData.getPastEvents event: ${msg}`)
        onPastEvent(msg)
      }
    })
}

function getAllAppEvents() {
  contract.flightSuretyApp.events.allEvents((error, event) => {
    const returnValues = JSON.stringify(event.returnValues)
    const msg = `${event.event}: ${returnValues}`

    console.log(
      `flightSuretyApp.getAllAppEvents error: ${error}, event: ${msg}`
    )
    onEvent(msg)
  })
}

function getAllDataEvents() {
  contract.flightSuretyData.events.allEvents((error, event) => {
    const returnValues = JSON.stringify(event.returnValues)
    const msg = `${event.event}: ${returnValues}`

    console.log(
      `flightSuretyData.getAllDataEvents error: ${error}, event: ${msg}`
    )
    onEvent(msg)
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
  return new Promise((resolve, reject) => {
    contract.flightSuretyData.methods
      .setOperatingStatus(mode)
      .send({ from: contract.owner }, (error, result) => {
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

      const [
        activeAddresses,
        activeNames,
        registeredAddresses,
        registeredNames,
        unRegisteredAddresses,
        unRegisteredNames,
      ] = [result[0], result[1], result[2], result[3], result[4], result[5]]

      console.log({result})
      const airlineTypes = [
        activeAddresses,
        registeredAddresses,
        unRegisteredAddresses,
      ]
      const activeAirlines = [],
        registeredAirlines = [],
        unRegisteredAirlines = []

      airlineTypes.forEach((_, i) => {
        let addresses = null,
          names = null,
          targetArray = null,
          arrayName = null
        if (i === 0) {
          addresses = activeAddresses
          names = activeNames
          targetArray = activeAirlines
          arrayName = "Active"
        } else if (i === 1) {
          addresses = registeredAddresses
          names = registeredNames
          targetArray = registeredAirlines
          arrayName = "Registered"
        } else if (i === 2) {
          addresses = unRegisteredAddresses
          names = unRegisteredNames
          targetArray = unRegisteredAirlines
          arrayName = "Unregistered"
        } else throw Error("Invalid index")

        console.log({addresses})
        console.log({i})
        for (let j = 0; j < addresses.length; j++) {
          const airline = { address: addresses[j], name: names[j] }

          targetArray.push(airline)

          console.log(
            `${arrayName} airline address: ${airline.address}, name: ${airline.name}`
          )
        }
      })

      resolve([activeAirlines, registeredAirlines, unRegisteredAirlines])
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
      .send({ from: contract.owner, gas: "5000000" }, (error, result) => {
        if (error) {
          console.error(error)
          return reject(error)
        }

        console.log(`Airline registered: ${result}`)

        resolve(result)
      })
  })
}
