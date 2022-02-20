var Test = require("../config/testConfig.js")
var BigNumber = require("bignumber.js")

contract("Flight Surety Data Tests", async (accounts) => {
  var config
  before("setup contract", async () => {
    config = await Test.Config(accounts)
    await config.flightSuretyData.authorizeCaller(
      config.flightSuretyApp.address
    )
  })

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/
  it(`(multiparty) has correct initial isOperational() value`, async function () {
    // Get operating status
    // let status = await config.flightSuretyData.isOperational.call()
    // assert.equal(status, true, "Incorrect initial operating status value")
  })
})
