import web3 from "web3"
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
  fundAirline,
  voteForAirline,
  registerFlight,
  getFlights,
  getFlight,
  requestFlightStatus,
  freezeFlight,
  creditInsurees,
  buyInsurance,
  filterUniqAirlines,
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
    contract.flightSuretyData.methods
      .getAirlines()
      .call({ from: contract.owner }, (error, result) => {
        if (error) {
          console.error(error)
          return reject(error)
        }

        const [airlineAddresses, airlineNames, airlineStatus] = [
          result[0],
          result[1],
          result[2],
        ]

        console.log(
          `getAirlines success ${result[0].length} active, ${result[1].length} registered, ${result[2].length} unregistered`
        )

        const airlines = []

        for (let i = 0; i < airlineAddresses.length; i++) {
          const airline = {
            address: airlineAddresses[i],
            name: airlineNames[i],
            status: airlineStatus[i],
          }

          airlines.push(airline)

          console.log(
            `${
              airline.status[0].toUpperCase() + airline.status.slice(1)
            } airline address: ${airline.address}, name: ${airline.name}`
          )
        }

        resolve(airlines)
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

function fundAirline(airlineAddress, amount) {
  return new Promise((resolve, reject) => {
    contract.flightSuretyApp.methods.provideAirlinefunding(airlineAddress).send(
      {
        from: airlineAddress,
        value: web3.utils.toWei(amount),
        gas: "5000000",
      },
      (error, result) => {
        if (error) {
          console.error(error)
          return reject(error)
        }

        console.log(`Airline funded: ${result}`)

        resolve(result)
      }
    )
  })
}

function voteForAirline(airlineToVoteFor, votingAirline) {
  if (
    airlineToVoteFor === "Airline to Vote for" ||
    votingAirline === "Voting Airline"
  ) {
    return alert("Please select correct airlines")
  }

  return new Promise((resolve, reject) => {
    contract.flightSuretyApp.methods
      .voteForAirline(airlineToVoteFor)
      .send({ from: votingAirline, gas: "5000000" }, (error, result) => {
        if (error) {
          console.error(error)
          return reject(error)
        }

        console.log(`Airline voted for: ${result}`)

        resolve(result)
      })
  })
}

function registerFlight(airlineAddress, flightName) {
  if (airlineAddress === "Airlines") {
    return alert("Please select a correct airline")
  } else if ((flightName = "")) {
    return alert("Please provide a flight name")
  }

  return new Promise((resolve, reject) => {
    contract.flightSuretyData.methods
      .registerFlightForInsurance(airlineAddress, flightName)
      .send({ from: contract.owner }, (error, result) => {
        if (error) {
          console.error(error)
          return reject(error)
        }

        console.log(`Registered flight for insurance: ${result}`)

        resolve(result)
      })
  })
}

function getFlights(airlineAddress) {
  if (airlineAddress === "Airlines") {
    return alert("Please select a correct airline")
  }

  return new Promise((resolve, reject) => {
    contract.flightSuretyData.methods
      .getFlights(airlineAddress)
      .call({ from: contract.owner }, (error, result) => {
        if (error) {
          console.error(error)
          return reject(error)
        }

        console.log(`Airline flights: ${result}`)

        resolve(result)
      })
  })
}

function getFlight(airlineAddress, flightName) {
  if (airlineAddress === "Airlines") {
    return alert("Please select a correct airline")
  } else if ((flightName = "")) {
    return alert("Please provide a flight name")
  }

  return new Promise((resolve, reject) => {
    contract.flightSuretyData.methods
      .getFlight(airlineAddress, flightName)
      .call({ from: contract.owner }, (error, result) => {
        if (error) {
          console.error(error)
          return reject(error)
        }

        console.log(`Flight: ${result}`)

        resolve(result)
      })
  })
}

function requestFlightStatus(airlineAddress, flightName) {
  if (airlineAddress === "Airlines") {
    return alert("Please select a correct airline")
  } else if ((flightName = "")) {
    return alert("Please provide a flight name")
  }

  return new Promise((resolve, reject) => {
    contract.flightSuretyApp.methods
      .requestFlightStatus(airlineAddress, flightName)
      .call({ from: contract.owner }, (error, result) => {
        if (error) {
          console.error(error)
          return reject(error)
        }

        console.log(`Flight status requested: ${result}`)

        resolve(result)
      })
  })
}

function freezeFlight(airlineAddress, flightName) {
  return new Promise((resolve, reject) => {
    contract.flightSuretyData.methods
      .freezeFlight(airlineAddress, flightName)
      .call({ from: airlineAddress }, (error, result) => {
        if (error) {
          console.error(error)
          return reject(error)
        }

        console.log(`Flight is frozen: ${result}`)

        resolve(result)
      })
  })
}

function creditInsurees(airlineAddress, flightName) {
  return new Promise((resolve, reject) => {
    contract.flightSuretyData.methods
      .creditInsurees(airlineAddress, flightName)
      .send({ from: contract.owner }, (error, result) => {
        if (error) {
          console.error(error)
          return reject(error)
        }

        console.log(`Flight insurees credited: ${result}`)

        resolve(result)
      })
  })
}

function buyInsurance(
  airlineAddress,
  flightName,
  insureeAddress,
  insuranceAmount
) {
  return new Promise((resolve, reject) => {
    contract.flightSuretyData.methods
      .buyInsuranceForFlight(airlineAddress, flightName)
      .send(
        { from: insureeAddress, value: insuranceAmount },
        (error, result) => {
          if (error) {
            console.error(error)
            return reject(error)
          }

          console.log(`Flight insuree bought: ${result}`)

          resolve(result)
        }
      )
  })
}

function filterUniqAirlines(airline, select) {
  let alreadyExist = false
  $(select)
    .children("option")
    .each((_i, option) => {
      if ($(option).val() === airline.address) alreadyExist = true
    })

  if (alreadyExist) return false

  return true
}
