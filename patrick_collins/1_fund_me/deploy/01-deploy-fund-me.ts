import fs from "fs"
import { network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
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

  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : 6

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: waitBlockConfirmations,
  })
  log(`FundMe deployed at ${fundMe.address}`)

  // frontend info
  const dappDeploymentFile = path.join(
    __dirname,
    "../dapp/src/utils/deployment.json"
  )
  const deploymentFile = path.join(
    __dirname,
    `../deployments/${
      network.name === "hardhat" ? "localhost" : network.name
    }/FundMe.json`
  )

  let data: any = {}
  if (fs.existsSync(dappDeploymentFile)) {
    log("Found existing deployment file")
    const currentData = fs.readFileSync(dappDeploymentFile, {
      encoding: "utf8",
      flag: "r",
    })
    data = JSON.parse(currentData)
  }

  const newData = fs.readFileSync(deploymentFile, {
    encoding: "utf8",
    flag: "r",
  })
  data[chainId] = JSON.parse(newData)

  fs.writeFileSync(
    dappDeploymentFile,
    JSON.stringify(data, null, "\t"),
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
deploy.tags = ["all", "fundme"]
