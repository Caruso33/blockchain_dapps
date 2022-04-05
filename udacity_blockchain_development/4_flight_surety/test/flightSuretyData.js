let Test = require("../config/testConfig.js")
let BigNumber = require("bignumber.js")
const truffleAssert = require("truffle-assertions")

contract("Flight Surety Data Tests", async (accounts) => {
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

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/
  describe("multiparty operational contract status", () => {
    it(`has correct initial isOperational() value`, async function () {
      // Get operating status
      let status = await config.flightSuretyData.isOperational.call()
      assert.equal(status, true, "Incorrect initial operating status value")
    })

    it(`can block access to setOperatingStatus() for non-Contract Owner account`, async function () {
      // Ensure that access is denied for non-Contract Owner account
      let accessDenied = false
      try {
        await config.flightSuretyData.setOperatingStatus(false, {
          from: config.testAddresses[0],
        })
      } catch (e) {
        accessDenied = true
      }
      assert.equal(
        accessDenied,
        true,
        "Access not restricted to Contract Owner"
      )
    })

    it(`can allow access to setOperatingStatus() for Contract Owner account`, async function () {
      // Ensure that access is allowed for Contract Owner account
      let accessDenied = false
      try {
        await config.flightSuretyData.setOperatingStatus(false)
        let status = await config.flightSuretyData.isOperational.call()
        assert.equal(status, false, "Operating status value wasn't changed")
      } catch (e) {
        accessDenied = true
      }
      assert.equal(
        accessDenied,
        false,
        "Access not restricted to Contract Owner"
      )
    })

    it(`can block access to functions using requireIsOperational when operating status is false`, async function () {
      await config.flightSuretyData.setOperatingStatus(false)

      let reverted = false
      try {
        await config.flightSurety.setTestingMode(true)
      } catch (e) {
        reverted = true
      }
      assert.equal(
        reverted,
        true,
        "Access not blocked for requireIsOperational"
      )

      // Set it back for other tests to work
      await config.flightSuretyData.setOperatingStatus(true)
    })
  })

  describe("(de-)authorize caller", () => {
    it("can (de-)authorize a caller only as contract owner", async () => {
      let accessDenied = false
      try {
        await config.flightSuretyData.authorizeCaller(config.testAddresses[1], {
          from: config.testAddresses[0],
        })
      } catch (e) {
        accessDenied = true
      }
      assert.equal(
        accessDenied,
        true,
        "Access not restricted to Contract Owner"
      )
    })

    it("contract owner can authorize and deauthorize contracts", async () => {
      const airline = config.firstAirline

      await config.flightSuretyData.authorizeCaller(airline, {
        from: config.owner,
      })
      let isAuthorized = await config.flightSuretyData.isAuthorizedCaller(
        airline
      )
      assert.equal(
        isAuthorized,
        true,
        "Contract owner cannot authorize other contracts"
      )
      await config.flightSuretyData.deauthorizeCaller(airline, {
        from: config.owner,
      })

      isAuthorized = await config.flightSuretyData.isAuthorizedCaller(airline)

      assert.equal(
        isAuthorized,
        false,
        "Contract owner cannot deauthorize other contracts"
      )
    })
  })

  describe("airline functionality", () => {
    it("not authorized caller can't create an airline", async () => {
      let accessDenied = false
      let event = null
      try {
        event = await config.flightSuretyData.createAirline(
          airlines[0].name,
          airlines[0].address,
          {
            from: config.testAddresses[0],
          }
        )
      } catch (e) {
        accessDenied = true
      }
      assert.ok(accessDenied, "Access not restricted to Contract Owner")
    })

    it("owner can create an airline", async () => {
      let accessDenied = false
      let event = null
      try {
        event = await config.flightSuretyData.createAirline(
          airlines[0].name,
          airlines[0].address,
          {
            from: config.owner,
          }
        )
      } catch (e) {
        accessDenied = true
      }
      assert.ok(!accessDenied, "Access not restricted to Contract Owner")
      truffleAssert.eventEmitted(event, "AirlineCreated")
      truffleAssert.eventEmitted(event, "AirlineRegistered")
    })

    it("first 3 airlines are already registered automatically, afterwards they are just created", async () => {
      let event = null
      for (let [i, airline] of airlines.entries()) {
        event = await config.flightSuretyData.createAirline(
          airline.name,
          airline.address,
          {
            from: config.owner,
          }
        )

        const isRegistered = await config.flightSuretyData.isAirlineRegistered(
          airline.address
        )
        if (i < 3) {
          assert.ok(isRegistered, `Airline ${airline.name} is not registered`)
          truffleAssert.eventEmitted(event, "AirlineCreated")
          truffleAssert.eventEmitted(event, "AirlineRegistered")
        } else {
          assert.ok(
            !isRegistered,
            `Airline ${airline.name} is registered, should be voted upon though`
          )
          truffleAssert.eventEmitted(event, "AirlineCreated")
        }
      }
    })

    it("cannot create a registered airline twice", async () => {
      await config.flightSuretyData.createAirline(
        airlines[0].name,
        airlines[0].address,
        {
          from: config.owner,
        }
      )

      await truffleAssert.reverts(
        config.flightSuretyData.createAirline(
          airlines[0].name,
          airlines[0].address,
          {
            from: config.owner,
          }
        ),
        "Airline already exists"
      )
    })

    it("cannot create a created airline twice", async () => {
      for (let airline of airlines) {
        await config.flightSuretyData.createAirline(
          airline.name,
          airline.address,
          {
            from: config.owner,
          }
        )
      }

      await truffleAssert.reverts(
        config.flightSuretyData.createAirline(
          airlines[3].name,
          airlines[3].address,
          {
            from: config.owner,
          }
        ),
        "Airline already exists"
      )
    })

    it("(only) registered airlines can provide funding", async () => {
      let event = null

      for (let [i, airline] of airlines.entries()) {
        await config.flightSuretyData.createAirline(
          airline.name,
          airline.address,
          {
            from: config.owner,
          }
        )
      }

      const airlineBefore = await config.flightSuretyData.getAirline(
        airlines[0].address
      )

      const initialAirlineFunding =
        await config.flightSuretyData.getInitialFunding()
      const activeAirlineCount =
        await config.flightSuretyData.getActiveAirlineCount()

      event = await config.flightSuretyData.provideAirlinefunding(
        airlines[0].address,
        {
          value: initialAirlineFunding,
          // value: web3.utils.toWei("1", "ether"),
          from: airlines[0].address,
        }
      )
      truffleAssert.eventEmitted(event, "AirlineFunded")

      const airline = await config.flightSuretyData.getAirline(
        airlines[0].address
      )
      assert.ok(airline[2], "Airline is not registered")
      assert.ok(airline[3], "Airline is not active")
      assert(
        airline[5],
        airlineBefore[5] + initialAirlineFunding,
        "Funding of airline hasn't increased"
      )

      assert(
        await config.flightSuretyData.getActiveAirlineCount(),
        activeAirlineCount + 1,
        "Active airlines has not increased"
      )

      await truffleAssert.reverts(
        config.flightSuretyData.provideAirlinefunding(airlines[3].address, {
          from: airlines[3].address,
        }),
        "Airline is not registered"
      )
    })

    it.only("(only) active airlines can vote for othere airlines", async () => {
      let event = null

      airlines.forEach(async (airline) => {
        await config.flightSuretyData.createAirline(
          airline.name,
          airline.address,
          {
            from: config.owner,
          }
        )
      })

      await truffleAssert.reverts(
        config.flightSuretyData.voteForAirline(airlines[1].address, {
          from: airlines[0].address,
        }),
        "Airline is not authorized, i.e. active through funding"
      )

      const initialAirlineFunding =
        await config.flightSuretyData.getInitialFunding()
      const registeredAirlineCount =
        await config.flightSuretyData.getRegisteredAirlineCount()

      airlines.slice(0, 3).forEach(async (airline) => {
        await config.flightSuretyData.provideAirlinefunding(airline.address, {
          value: initialAirlineFunding,
          from: airline.address,
        })
      })

      const airlineBefore = await config.flightSuretyData.getAirline(
        airlines[3].address
      )

      event = await config.flightSuretyData.voteForAirline(
        airlines[3].address,
        {
          from: airlines[0].address,
        }
      )

      truffleAssert.eventEmitted(event, "AirlineRegistrationVoted")

      let airline = await config.flightSuretyData.getAirline(
        airlines[3].address
      )
      assert(
        airline[4],
        airlineBefore[4] + 1,
        "Votes of airlines hasn't increased"
      )
      assert.isNotOk(
        airline[2],
        "Airline shouldn't be registered yet, too few votes"
      )

      event = await config.flightSuretyData.voteForAirline(
        airlines[3].address,
        {
          from: airlines[1].address,
        }
      )
      airline = await config.flightSuretyData.getAirline(airlines[3].address)
      assert.ok(
        airline[2],
        "Airline should be registered now, enough votes done"
      )
      truffleAssert.eventEmitted(event, "AirlineRegistrationVoted")

      assert(
        await config.flightSuretyData.getRegisteredAirlineCount(),
        registeredAirlineCount + 1,
        "Registered airlines has not increased"
      )
    })

    it("cannot register an Airline using registerAirline() if it is not funded", async () => {
      // ARRANGE
      const newAirline = config.firstAirline

      // ACT
      try {
        await config.flightSuretyData.registerAirline(newAirline, {
          // from: config.firstAirline,
          from: owner,
        })
      } catch (e) {}
      const isRegistered =
        await config.flightSuretyData.isAirlineRegistered.call(newAirline)
      const isActive = await config.flightSuretyData.isAirlineRegistered.call(
        newAirline
      )

      // ASSERT
      assert.equal(
        isRegistered,
        false,
        "Airline should not be able to register another airline if it hasn't provided funding"
      )
      assert.equal(
        isActive,
        false,
        "Airline should not be able to register another airline if it hasn't provided funding"
      )
    })
  })
})
