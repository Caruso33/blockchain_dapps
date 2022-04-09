module.exports = {
  createAirlines,
  voteForAirlines,
  advanceTime,
  advanceBlock,
  takeSnapshot,
  revertToSnapshot,
  advanceTimeAndBlock,
}

// https://github.com/ejwessel/GanacheTimeTraveler

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

function advanceTime(time) {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [time],
        id: new Date().getTime(),
      },
      (err, result) => {
        if (err) {
          return reject(err)
        }
        return resolve(result)
      }
    )
  })
}

function advanceBlock() {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "evm_mine",
        id: new Date().getTime(),
      },
      (err, result) => {
        if (err) {
          return reject(err)
        }
        const newBlockHash = web3.eth.getBlock("latest").hash

        return resolve(newBlockHash)
      }
    )
  })
}

function takeSnapshot() {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "evm_snapshot",
        id: new Date().getTime(),
      },
      (err, snapshotId) => {
        if (err) {
          return reject(err)
        }
        return resolve(snapshotId)
      }
    )
  })
}

function revertToSnapshot(id) {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "evm_revert",
        params: [id],
        id: new Date().getTime(),
      },
      (err, result) => {
        if (err) {
          return reject(err)
        }
        return resolve(result)
      }
    )
  })
}

async function advanceTimeAndBlock(time) {
  await advanceTime(time)
  await advanceBlock()
  return Promise.resolve(web3.eth.getBlock("latest"))
}
