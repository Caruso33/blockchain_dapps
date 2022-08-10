import { frontEndContractsFile, frontEndAbiFile } from "../hardhat-helper-config"
import fs from "fs"
import { network, ethers } from "hardhat"

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END && process.env.UPDATE_FRONT_END === "true") {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    const raffle = await ethers.getContract("Raffle")
    fs.writeFileSync(frontEndAbiFile, raffle.interface.format(ethers.utils.FormatTypes.json) as string)
}

async function updateContractAddresses() {
    const chainId = network.config.chainId!

    const raffle = await ethers.getContract("Raffle")
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    if (chainId.toString() in contractAddresses) {
        if (!contractAddresses[chainId.toString()].includes(raffle.address)) {
            contractAddresses[chainId.toString()].push(raffle.address)
        }
    } else {
        contractAddresses[chainId.toString()] = [raffle.address]
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]
