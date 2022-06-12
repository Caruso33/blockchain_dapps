import { Listener } from "@ethersproject/providers"
import { BigNumber, Contract, utils } from "ethers"
import { Dispatch } from "react"
import { actionTypes } from "../state/reducer"

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

function subscribeCancelOrderEvents(
  contract: Contract,
  dispatch: Dispatch<any>
) {
  if (!contract) return

  const listener: Listener = (
    id: BigNumber,
    user: string,
    timestamp: BigNumber
  ) => {
    console.log("id", id.toString(), user, timestamp.toString())

    dispatch({
      type: actionTypes.ADD_CANCEL_ORDER,
      data: { id, user },
    })
  }

  subscribeEvents(
    contract,
    // "CancelOrderEvent",
    {
      topics: [utils.id("CancelOrderEvent(uint256,address,uint256)")],
      fromBlock: "latest",
    },
    listener
  )
}

export { subscribeCancelOrderEvents }
