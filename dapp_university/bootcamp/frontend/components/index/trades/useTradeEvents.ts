import fromUnixTime from "date-fns/fromUnixTime"
import { BigNumber, ethers } from "ethers"
import { useMemo } from "react"
import useAppState from "../../../state"
import { TradeEvent } from "../../../types"

type TradeEventEnhanced = TradeEvent & {
  orderType: "buy" | "sell"
  etherAmount: BigNumber
  tokenAmount: BigNumber
  tokenPrice: number
  dateTime: Date
  didPriceIncrease: boolean
  hasUserBought: boolean
}

function useTradeEvents() {
  const [state] = useAppState()

  const tradeEvents = useMemo(() => {
    if (!state?.events?.trades) return []

    const userAddress = state.user.account.address
    const precision = 10 ** 5

    let events = state.events.trades.sort(
      (a, b) => b.timestamp.toNumber() - a.timestamp.toNumber()
    )

    let previousEvent: TradeEventEnhanced | undefined

    events = events.map((tradeEvent: TradeEventEnhanced) => {
      const { tokenGive, amountGet, amountGive, id } = tradeEvent
      const { orderUser, timestamp, tokenGet, trader } = tradeEvent

      const orderType =
        tokenGive.toString() === ethers.constants.AddressZero ? "buy" : "sell"

      let etherAmount
      let tokenAmount

      if (tokenGive === ethers.constants.AddressZero) {
        etherAmount = amountGive
        tokenAmount = amountGet
      } else {
        etherAmount = amountGet
        tokenAmount = amountGive
      }

      let tokenPrice = etherAmount.toNumber() / tokenAmount.toNumber()
      tokenPrice = Math.round(tokenPrice * precision) / precision

      const dateTime = fromUnixTime(timestamp.toNumber())

      const didPriceIncrease =
        !previousEvent || tokenPrice > previousEvent.tokenPrice

      const hasUserBought =
        (orderType === "buy" && trader === userAddress) ||
        (orderType === "sell" && orderUser === userAddress)

      return {
        tokenGive,
        amountGet,
        amountGive,
        id,
        orderUser,
        timestamp,
        tokenGet,
        trader,
        orderType,
        etherAmount,
        tokenAmount,
        tokenPrice,
        dateTime,
        didPriceIncrease,
        hasUserBought,
      } as TradeEventEnhanced
    })

    const myTradeEvents = events.filter(
      (event: TradeEventEnhanced) =>
        event.orderUser === userAddress || event.trader === userAddress
    )

    return [events, myTradeEvents]
  }, [state.events.trades, state.user.account.address])

  return tradeEvents
}

export default useTradeEvents
export type { TradeEventEnhanced }
