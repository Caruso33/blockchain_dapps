import { Listener } from "@ethersproject/providers"
import { BigNumber, Contract, utils } from "ethers"
import { Dispatch } from "react"

function subscribeEvents(
  contract: Contract,
  eventName: string | object,
  listener: Listener
) {
  console.log(
    `Subscribing to ${
      typeof eventName === "string" ? eventName : eventName?.topics?.join(", ")
    } events`
  )
  contract.on(eventName, listener)
}

function subscribeCancelOrderEvents(contract: Contract, dispatch: Dispatch) {
  if (!contract) return

  const listener: Listener = (id: BigNumber, user: string) =>
    console.dir("id", id.toString(), "user", user)

  subscribeEvents(
    contract,
    // "CancelOrderEvent",
    {
      topics: [utils.id("CancelOrderEvent(uint256,address)")],
      fromBlock: "latest",
    },
    listener
  )
}

export { subscribeCancelOrderEvents }
