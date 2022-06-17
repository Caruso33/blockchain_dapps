const {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../constants/hardhat-helper")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS

  if (chainId == 1337) {
    const arguments = []

    const contract = await deploy("NFTMarket", {
      from: deployer,
      args: arguments,
      log: true,
      waitConfirmations: waitBlockConfirmations,
    })

    // Verify the deployment
    if (
      !developmentChains.includes(network.name) &&
      (process.env.ETHERSCAN_API_KEY || process.env.POLYSCAN_API_KEY)
    ) {
      log("Verifying...")
      await verify(contract.address, arguments)
    }
    log("----------------------------------------------------")
  }
}

module.exports.tags = ["all", "contract"]
