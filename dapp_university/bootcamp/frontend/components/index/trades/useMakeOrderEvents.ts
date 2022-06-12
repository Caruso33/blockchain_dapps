import fromUnixTime from "date-fns/fromUnixTime"
import { BigNumber, ethers } from "ethers"
import { useEffect, useState } from "react"
import useAppState from "../../../state"
import { CancelOrderEvent, MakeOrderEvent } from "../../../types"
import useTradeEvents, { TradeEventEnhanced } from "./useTradeEvents"

type MakeOrderEventEnhanced = MakeOrderEvent & {
  orderType: "buy" | "sell"
  etherAmount: BigNumber
  tokenAmount: BigNumber
  tokenPrice: number
  dateTime: Date
}

function useMakeOrderEvents() {
  const [state] = useAppState()

  const [tradeEvents] = useTradeEvents()

  const [makeOrderEvents, setMakeOrderEvents] = useState<Array<any>>([
    [],
    [],
    [],
    [],
  ])
  console.dir(
    state?.events?.cancelOrders?.[
      state?.events?.cancelOrders?.length - 1
    ]?.id?.toString(),
    makeOrderEvents[3]?.map((order) => order.id.toString())
  )
  // const makeOrderEvents =
  useEffect(() => {
    console.log("run makeOrderEvents")

    const precision = 10 ** 5

    let events = state.events.makeOrders.map(
      (makeOrderEvent: MakeOrderEvent) => {
        const { tokenGive, amountGet, amountGive, id } = makeOrderEvent
        const { timestamp, tokenGet, user } = makeOrderEvent

        const orderType =
          tokenGive.toString() === ethers.constants.AddressZero ? "buy" : "sell"

        let etherAmount
        let tokenAmount

        if (tokenGive.toString() === ethers.constants.AddressZero) {
          etherAmount = amountGive
          tokenAmount = amountGet
        } else {
          etherAmount = amountGet
          tokenAmount = amountGive
        }

        let tokenPrice = etherAmount.toNumber() / tokenAmount.toNumber()
        tokenPrice = Math.round(tokenPrice * precision) / precision

        const dateTime = fromUnixTime(timestamp.toNumber())

        return {
          tokenGive,
          amountGet,
          amountGive,
          id,
          user,
          timestamp,
          tokenGet,
          orderType,
          etherAmount,
          tokenAmount,
          tokenPrice,
          dateTime,
        } as MakeOrderEventEnhanced
      }
    )

    events = events.filter((event: MakeOrderEventEnhanced) => event.tokenPrice)

    const cancelledAndFilledIds = [
      ...state?.events?.cancelOrders,
      ...tradeEvents,
    ].map((event: CancelOrderEvent | TradeEventEnhanced) => event.id.toString())

    console.dir(
      state?.events?.cancelOrders?.[
        state?.events?.cancelOrders?.length - 1
      ]?.id?.toString()
    )

    events = events.filter(
      (event: MakeOrderEventEnhanced) =>
        !cancelledAndFilledIds.includes(event.id.toString())
    )

    events = events.sort((a, b) => b.tokenPrice - a.tokenPrice)

    const buyOrders = events.filter(
      (event: MakeOrderEventEnhanced) => event.orderType === "buy"
    )
    const sellOrders = events.filter(
      (event: MakeOrderEventEnhanced) => event.orderType === "sell"
    )

    const myOrders = events.filter(
      (event: MakeOrderEventEnhanced) =>
        event.user === state.user.account.address
    )

    setMakeOrderEvents([events, buyOrders, sellOrders, myOrders])
  }, [
    state.events.trades,
    state.events.makeOrders,
    state.events.cancelOrders,
    state.user.account.address,
    tradeEvents,
  ])

  return makeOrderEvents
}

export default useMakeOrderEvents
export type { MakeOrderEventEnhanced }
