import { setHours } from "date-fns"
import fromUnixTime from "date-fns/fromUnixTime"
import getHours from "date-fns/getHours"
import { BigNumber, ethers, Event } from "ethers"
import groupBy from "lodash/groupBy"
import maxBy from "lodash/maxBy"
import minBy from "lodash/minBy"
import { useMemo } from "react"
import useAppState from "../../../state"

type TradeEvent = {
  amountGet: BigNumber
  amountGive: BigNumber
  id: BigNumber
  orderUser: string
  timestamp: BigNumber
  tokenGet: string
  tokenGive: string
  trader: string
}

type TradeEventEnhanced = TradeEvent & {
  orderType: "buy" | "sell"
  etherAmount: BigNumber
  tokenAmount: BigNumber
  tokenPrice: number
  dateTime: Date
  didPriceIncrease: boolean
  hasUserBought: boolean
}

function useTradePriceChartEvents() {
  const [state] = useAppState()

  const tradeEvents = useMemo(() => {
    if (!state?.events?.trades) return []

    const precision = 10 ** 5

    let events = state.events.trades.sort(
      (a, b) => a.timestamp.toNumber() - b.timestamp.toNumber()
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
        (orderType === "buy" && trader === state.user.account.address) ||
        (orderType === "sell" && orderUser === state.user.account.address)

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

    const groupedEvents = groupBy(events, (event) => {
      return getHours(event.dateTime)
    })

    const priceChartTrades = []
    for (const hour of Object.keys(groupedEvents)) {
      const tradeEvents: Array<TradeEventEnhanced> = groupedEvents[hour]

      const high = maxBy(tradeEvents, (event) => event.tokenPrice)
      const low = minBy(tradeEvents, (event) => event.tokenPrice)

      priceChartTrades.push({
        x: setHours(new Date(), Number(hour)),
        y: [
          tradeEvents[0].tokenPrice,
          high?.tokenPrice,
          low?.tokenPrice,
          tradeEvents[tradeEvents.length - 1].tokenPrice,
        ],
      })
    }

    const [secondLast, last] = events.slice(-2)

    const secondLastPrice = secondLast?.tokenPrice || 0
    const lastPrice = last?.tokenPrice || 0

    const lastPriceChange = lastPrice - secondLastPrice

    return [priceChartTrades, lastPrice, lastPriceChange]
  }, [state.events.trades, state.user.account.address])

  return tradeEvents
}

export default useTradePriceChartEvents
export type { TradeEventEnhanced }
