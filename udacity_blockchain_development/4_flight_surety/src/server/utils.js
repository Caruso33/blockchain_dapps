module.exports = {
  registerOracles,
  onOracleRequest,
  onFlightStatusInfo,
}

function registerOracles(
  web3,
  flightSuretyApp,
  { oracleAccounts, oracleIndexes, totalOracles, oracleInitialIndex }
) {
  // Transaction parameters
  let registrationFee = web3.utils.toWei("1", "ether")
  let transactionGas = "2000000"

  web3.eth.getAccounts((error, accounts) => {
    for (let i = 0; i < totalOracles; i++) {
      let oracleAddress
      oracleAddress = accounts[oracleInitialIndex + i]
      oracleAccounts.push(oracleAddress)

      const onRegisterOracle = (error, result) => {
        if (error) console.error(error)
        else {
          console.log(result)

          flightSuretyApp.methods
            .getMyIndexes()
            .call({ from: oracleAddress }, (error, result) => {
              console.log(`Oracle ${oracleAddress} has index ${result}`)
              oracleIndexes[oracleAddress] = result
            })
        }
      }

      flightSuretyApp.methods
        .registerOracle()
        .send(
          { from: oracleAddress, value: registrationFee, gas: transactionGas },
          onRegisterOracle
        )
    }
  })
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
