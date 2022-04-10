var Test = require("../config/testConfig.js")
const {
  createAirlines,
  voteForAirlines,
  registerOracles,
} = require("./utils.js")
const truffleAssert = require("truffle-assertions")
//var BigNumber = require('bignumber.js');

contract("Oracles", async (accounts) => {
  const TEST_ORACLES_COUNT = 3

  // Watch contract events
  const STATUS_CODE_UNKNOWN = 0
  const STATUS_CODE_ON_TIME = 10
  const STATUS_CODE_LATE_AIRLINE = 20
  const STATUS_CODE_LATE_WEATHER = 30
  const STATUS_CODE_LATE_TECHNICAL = 40
  const STATUS_CODE_LATE_OTHER = 50

  const activationFee = web3.utils.toWei("10", "ether")

  let config
  let airlines = []

  beforeEach("setup contract", async () => {
    config = await Test.Config(accounts)

    await config.flightSuretyData.authorizeCaller(
      config.flightSuretyApp.address
    )
    await config.flightSuretyData.authorizeCaller(config.owner)

    airlines = [
      { name: "Airline 1", address: config.firstAirline },
      { name: "Airline 2", address: config.secondAirline },
      { name: "Airline 3", address: config.thirdAirline },
      { name: "Airline 4", address: config.fourthAirline },
      { name: "Airline 5", address: config.fifthAirline },
    ]
  })

  it("can register oracles", async () => {
    // ARRANGE
    const registration_fee =
      await config.flightSuretyApp.REGISTRATION_FEE.call()

    // ACT
    for (let i = 1; i < TEST_ORACLES_COUNT; i++) {
      await config.flightSuretyApp.registerOracle({
        from: accounts[i],
        value: registration_fee,
      })

      const result = await config.flightSuretyApp.getMyIndexes.call({
        from: accounts[i],
      })

      console.log(`Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]}`)
    }
  })

  it.only("can request flight status", async () => {
    await createAirlines(config, airlines)

    await voteForAirlines(config, airlines)

    await config.flightSuretyData.provideAirlinefunding(airlines[0].address, {
      from: airlines[0].address,
      value: activationFee,
    })

    const flight = "Flight 001"
    const insurancePrice = web3.utils.toWei("0.01", "ether")
    await config.flightSuretyApp.registerFlightForInsurance(
      airlines[0].address,
      flight,
      insurancePrice,
      { from: airlines[0].address }
    )

    await registerOracles(config, accounts, TEST_ORACLES_COUNT)

    const event = await config.flightSuretyApp.fetchFlightStatus(
      airlines[0].address,
      flight,
      { from: airlines[0].address }
    )

    const [requestIndex, timestamp] = await new Promise((resolve, reject) => {
      truffleAssert.eventEmitted(event, "OracleRequest", (ev) => {
        resolve([ev.index.toNumber(), ev.timestamp.toNumber()])
      })
    })
    console.log("Request index ", requestIndex)
    console.log("Request timestamp ", timestamp)

    const min_responses = 3 // await config.flightSuretyApp.MIN_RESPONSES.call()

    const promises = []
    for (let i = 1; i <= TEST_ORACLES_COUNT; i++) {
      promises.push(
        new Promise(async (resolve, reject) => {
          try {
            const oracleIndexes =
              await config.flightSuretyApp.getMyIndexes.call({
                from: accounts[i],
              })

            const event = await config.flightSuretyApp.submitOracleResponse(
              oracleIndexes,
              requestIndex,
              airlines[0].address,
              flight,
              timestamp,
              STATUS_CODE_ON_TIME,
              { from: accounts[i] }
            )

            resolve(event)
          } catch (err) {
            console.log("error", err)
            reject(err)
          }
        })
      )
    }

    await Promise.all(promises).then(async (events) => {
      const hasEnoughResponses = TEST_ORACLES_COUNT >= min_responses

      for (const event of events) {
        truffleAssert.eventEmitted(event, "OracleReport", (ev) => {
          return (
            ev.airline === airlines[0].address &&
            ev.status.toNumber() === STATUS_CODE_ON_TIME
          )
        })
      }

      if (hasEnoughResponses) {
        let flightStatusWasEmitted = false

        events.forEach((event) => {
          event.logs.forEach((log) => {
            if (
              log.event === "FlightStatusInfo" &&
              log.args.airline === airlines[0].address &&
              log.args.status.toNumber() === STATUS_CODE_ON_TIME
            ) {
              flightStatusWasEmitted = true
            }
          })
        })

        assert.ok(flightStatusWasEmitted, "FlightStatusInfo was not emitted")
      }
    })
  })

  it("can retrieve the correct flight status", async () => {
    // ARRANGE

    // ACT
    let result = await config.flightSuretyApp.fetchFlightStatus(
      airlines[0].address,
      flight
    )

    // ASSERT
    assert.equal(
      parseInt(result),
      STATUS_CODE_ON_TIME,
      "The correct status of the flight should be updated after 'FlightStatusInfo' event is emmited"
    )
  })
})
