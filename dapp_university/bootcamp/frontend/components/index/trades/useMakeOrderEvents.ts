import fromUnixTime from "date-fns/fromUnixTime"
import { BigNumber, ethers } from "ethers"
import { useMemo } from "react"
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

  const makeOrderEvents = useMemo(() => {
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

    events = events.filter(
      (event: MakeOrderEventEnhanced) =>
        !cancelledAndFilledIds.includes(event.id.toString())
    )

    events = events.sort(
      (a: MakeOrderEventEnhanced, b: MakeOrderEventEnhanced) =>
        b.tokenPrice - a.tokenPrice
    )

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

    return [events, buyOrders, sellOrders, myOrders]
  }, [
    state.user.account.address,
    state.events.makeOrders,
    state.events.cancelOrders,
    tradeEvents,
  ])

  return makeOrderEvents
}

export default useMakeOrderEvents
export type { MakeOrderEventEnhanced }
