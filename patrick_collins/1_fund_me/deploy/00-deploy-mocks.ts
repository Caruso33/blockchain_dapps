import { network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DECIMALS, INITIAL_PRICE } from "../scripts/hardhat-helper-config"

const mock = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const chainId = network.config.chainId!
  // If we are on a local development network, we need to deploy mocks!
  if (chainId === 1337) {
    log("Local network detected! Deploying mocks...")

    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE],
    })
    log("Mocks Deployed!")

    log("------------------------------------------------")
    log(
      "You are deploying to a local network, you'll need a local network running to interact"
    )
    log(
      "Please run `npx hardhat console` to interact with the deployed smart contracts!"
    )
    log("------------------------------------------------")
  }
}

export default mock
export const tags = ["all", "mocks"]
