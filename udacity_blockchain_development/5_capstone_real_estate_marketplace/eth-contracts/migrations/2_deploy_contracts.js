// migrating the appropriate contracts
const SquareVerifier = artifacts.require("./verifier.sol")
const ZokratesVerifier = artifacts.require("./ZokratesVerifier.sol")
const SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol")

module.exports = async (deployer) => {

//  await deployer.deploy(ZokratesVerifier)

  // deployer.deploy(SolnSquareVerifier, ZokratesVerifier.address)
}
