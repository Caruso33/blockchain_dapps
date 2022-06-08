import { BigNumber, Event } from "ethers";
import { useMemo } from "react";
import useAppState from "../../../state";

type TradeEvent = {
  amountGet: BigNumber;
  amountGive: BigNumber;
  id: BigNumber;
  length: number;
  orderUser: string;
  timestamp: BigNumber;
  tokenGet: string;
  tokenGive: string;
  trader: string;
};

function useTradeEvents() {
  const [state] = useAppState();

  const tradeEvents = useMemo(() => {
    if (!state?.events?.trades) return [];

    let events = state.events.trades.map((trade: Event) => {
      if (!trade.args) return {};

      const tradeEventArgs = trade.args as unknown as TradeEvent;

      return {
        amountGet: tradeEventArgs.amountGet,
        amountGive: tradeEventArgs.amountGive,
        id: tradeEventArgs.id,
        length: tradeEventArgs.length,
        orderUser: tradeEventArgs.orderUser,
        timestamp: tradeEventArgs.timestamp,
        tokenGet: tradeEventArgs.tokenGet,
        tokenGive: tradeEventArgs.tokenGive,
        trader: tradeEventArgs.trader,
      };
    });

    events = events.sort((a, b) => b.timestamp - a.timestamp);

    return events;
  }, [state.events.trades]);

  return tradeEvents;
}

export default useTradeEvents;
