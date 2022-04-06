function createAirlines(config, airlines) {
  airlines.forEach(async (airline) => {
    await config.flightSuretyData.createAirline(airline.name, airline.address, {
      from: config.owner,
    })
  })
}

async function voteForAirlines(config, airlines) {
    const initialAirlineFunding =
    await config.flightSuretyData.getInitialFunding()

  airlines.slice(0, 3).forEach(async (airline) => {
    await config.flightSuretyData.provideAirlinefunding(airline.address, {
      value: initialAirlineFunding,
      from: airline.address,
    })
  })
}

module.exports = { createAirlines, voteForAirlines }
