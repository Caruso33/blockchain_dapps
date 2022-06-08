import fromUnixTime from "date-fns/fromUnixTime";
import { BigNumber, ethers, Event } from "ethers";
import { useMemo } from "react";
import useAppState from "../../../state";

type TradeEvent = {
  amountGet: BigNumber;
  amountGive: BigNumber;
  id: BigNumber;
  orderUser: string;
  timestamp: BigNumber;
  tokenGet: string;
  tokenGive: string;
  trader: string;
};

type TradeEventWithAmount = TradeEvent & {
  etherAmount: BigNumber;
  tokenAmount: BigNumber;
  tokenPrice: number;
  dateTime: Date;
  didPriceIncrease: boolean;
};

function useTradeEvents() {
  const [state] = useAppState();

  const tradeEvents = useMemo(() => {
    if (!state?.events?.trades) return [];

    const precision = 10 ** 5;
    let events: Array<TradeEventWithAmount> = state.events.trades.map(
      (trade: Event) => {
        const tradeEventArgs = trade.args as unknown as TradeEvent;
        return tradeEventArgs;
      }
    );

    events = events.sort(
      (a, b) => b.timestamp.toNumber() - a.timestamp.toNumber()
    );

    let previousEvent: TradeEventWithAmount | undefined;
    events = events.map((tradeEvent: TradeEventWithAmount) => {
      const { tokenGive, amountGet, amountGive, id } = tradeEvent;
      const { orderUser, timestamp, tokenGet, trader } = tradeEvent;

      let etherAmount;
      let tokenAmount;

      if (tokenGive === ethers.constants.AddressZero) {
        etherAmount = amountGive;
        tokenAmount = amountGet;
      } else {
        etherAmount = amountGet;
        tokenAmount = amountGive;
      }

      let tokenPrice = etherAmount.toNumber() / tokenAmount.toNumber();
      tokenPrice = Math.round(tokenPrice * precision) / precision;

      const dateTime = fromUnixTime(timestamp.toNumber());

      const didPriceIncrease =
        !previousEvent || tokenPrice > previousEvent.tokenPrice;

      return {
        tokenGive,
        amountGet,
        amountGive,
        id,
        orderUser,
        timestamp,
        tokenGet,
        trader,
        etherAmount,
        tokenAmount,
        tokenPrice,
        dateTime,
        didPriceIncrease,
      } as TradeEventWithAmount;
    });

    return events;
  }, [state.events.trades]);

  return tradeEvents;
}

export default useTradeEvents;
export type { TradeEventWithAmount };
