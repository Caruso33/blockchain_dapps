module.exports = {
  getAccounts,
  registerOracles,
  getOracleIndexes,
  onFlightStatusInfo,
}

function getAccounts(web3, oracleInitialIndex) {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((error, accounts) => {
      const oracleAccounts = []

      if (error) {
        console.log("getAccounts: ", error.message)
        return reject(error.message)
      }

      for (let i = 0; i < accounts.length; i++) {
        const oracleAddress = accounts[oracleInitialIndex + i]
        oracleAccounts.push(oracleAddress)
      }
      resolve(oracleAccounts)
    })
  })
}

function getRegistrationFee(flightSuretyApp) {
  return flightSuretyApp.methods.REGISTRATION_FEE().call()
}

function getOracleIndexes(flightSuretyApp, totalOracles, accounts) {
  const promises = []

  for (let i = 0; i < totalOracles; i++) {
    const oracleAddress = accounts[i]

    promises.push(
      new Promise((resolve, reject) => {
        flightSuretyApp.methods
          .getMyIndexes()
          .call({ from: oracleAddress }, (error, result) => {
            if (error) {
              console.error("getOracleIndexes: ", error.message)
              return reject(error.message)
            }

            // console.log(`Oracle ${oracleAddress} has index ${result}`)

            resolve({ [oracleAddress]: result })
          })
      })
    )
  }

  return Promise.all(promises)
}

function registerOracles(flightSuretyApp, oracleAccounts, totalOracles) {
  return getRegistrationFee(flightSuretyApp)
    .then((registrationFee) => {
      const transactionGas = "2000000"

      const promises = []

      for (let i = 0; i < totalOracles; i++) {
        const oracleAddress = oracleAccounts[i]

        promises.push(
          new Promise((resolve, reject) => {
            flightSuretyApp.methods.registerOracle().send(
              {
                from: oracleAddress,
                value: registrationFee,
                gas: transactionGas,
              },
              (error, result) => {
                if (error) {
                  console.error("registerOracle: ", error.message)
                  return reject(error.message)
                }

                // console.log(`Oracle ${oracleAddress} registered`)

                resolve({ [oracleAddress]: result })
              }
            )
          })
        )
      }

      return Promise.all(promises)
    })
    .catch((e) => console.log(e.message))
}

function onOracleRequest(error, event) {
  // Flight status codes
  const statusCodes = [0, 10, 20, 30, 40, 50]

  if (error) console.log(error)

  if (event) {
    console.log(event)

    const eventResult = event.returnValues
    // Loop through all oracles and submit the response of those with an index
    // matching the one of the request
    for (let oracle of oracleAccounts) {
      const indexes = oracleIndexes[oracle]

      if (indexes) {
        if (
          eventResult.index == parseInt(indexes[0]) ||
          eventResult.index == parseInt(indexes[1]) ||
          eventResult.index == parseInt(indexes[2])
        ) {
          // The status code response is randomized for each oracle
          let randomIndex
          let status

          if (randomnessOverride) {
            // If there is a randomness override, this is the code assigned
            status = statusCodeOverride
          } else {
            // If there is no randomness override, the code assigned is random
            randomIndex = Math.floor(Math.random() * 6)
            status = statusCodes[randomIndex]
          }
          flightSuretyApp.methods
            .submitOracleResponse(
              eventResult.index,
              eventResult.airline,
              eventResult.flight,
              eventResult.timestamp,
              status
            )
            .send({ from: oracle, gas: transactionGas }, (error, result) => {
              if (error) console.log(error)

              console.log(
                `Response ${status} from oracle (${indexes}) ${oracle}: ${result}`
              )
            })
        }
      }
    }
  }
}

function onFlightStatusInfo(error, event) {
  if (error) console.log(error)

  console.log(event)
}
