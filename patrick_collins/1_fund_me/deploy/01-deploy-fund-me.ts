import { HardhatRuntimeEnvironment } from "hardhat/types"
import fs from "fs"
import { network } from "hardhat"
import path from "path"
import {
  developmentChains,
  networkConfig,
} from "../scripts/hardhat-helper-config"
import { verify } from "../scripts/verify"

const deploy = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre

  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId!

  let ethUsdPriceFeedAddress
  if (chainId === 1337) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator")
    ethUsdPriceFeedAddress = ethUsdAggregator.address
  } else {
    // @ts-ignore
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
  }

  log("----------------------------------------------------")
  log("Deploying FundMe and waiting for confirmations...")

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: 1, // network.config.blockConfirmations ||
  })
  log(`FundMe deployed at ${fundMe.address}`)

  // frontend info
  const config = {
    address: fundMe.address,
    abi: fundMe.abi,
    bytecode: fundMe.bytecode,
  }
  fs.writeFileSync(
    path.join(__dirname, "/../dapp/src/utils/deployment.json"),
    JSON.stringify(config, null, "\t"),
    "utf-8"
  )

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, [ethUsdPriceFeedAddress])
  }
}

export default deploy
export const tags = ["all", "fundme"]
