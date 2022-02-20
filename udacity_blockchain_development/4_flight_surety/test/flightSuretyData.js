let Test = require("../config/testConfig.js")
let BigNumber = require("bignumber.js")

contract("Flight Surety Data Tests", async (accounts) => {
  let config

  before("setup contract", async () => {
    config = await Test.Config(accounts)

    await config.flightSuretyData.authorizeCaller(
      config.flightSuretyApp.address
    )
    // await config.flightSuretyData.authorizeCaller(config.owner)
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

  it("(airline) owner can register airline", async () => {})

  it("(airline) cannot register an Airline using registerAirline() if it is not funded", async () => {
    // ARRANGE
    const newAirline = config.firstAirline

    // ACT
    try {
      await config.flightSuretyData.registerAirline(newAirline, {
        // from: config.firstAirline,
        from: owner,
      })
    } catch (e) {}
    const isRegistered = await config.flightSuretyData.isAirlineRegistered.call(
      newAirline
    )
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
