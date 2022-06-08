import fromUnixTime from "date-fns/fromUnixTime";
import { BigNumber, ethers, Event } from "ethers";
import { useMemo } from "react";
import useAppState from "../../../state";

type MakeOrderEvent = {
  id: BigNumber;
  user: string;
  tokenGet: BigNumber;
  amountGet: BigNumber;
  tokenGive: BigNumber;
  amountGive: BigNumber;
  timestamp: BigNumber;
};

type MakeOrderEventEnhanced = MakeOrderEvent & {
  orderType: "buy" | "sell";
  etherAmount: BigNumber;
  tokenAmount: BigNumber;
  tokenPrice: number;
  dateTime: Date;
};

function useMakeOrderEvents() {
  const [state] = useAppState();

  const makeOrderEvents = useMemo(() => {
    if (!state?.events?.trades) return [];

    const precision = 10 ** 5;
    let events: Array<MakeOrderEventEnhanced> = state.events.trades.map(
      (trade: Event) => {
        const makeOrderEventArgs = trade.args as unknown as MakeOrderEvent;
        return makeOrderEventArgs;
      }
    );

    events = events.map((makeOrderEvent: MakeOrderEvent) => {
      const { tokenGive, amountGet, amountGive, id } = makeOrderEvent;
      const { timestamp, tokenGet } = makeOrderEvent;

      const orderType =
        tokenGive.toString() === ethers.constants.AddressZero ? "buy" : "sell";

      let etherAmount;
      let tokenAmount;

      if (tokenGive.toString() === ethers.constants.AddressZero) {
        etherAmount = amountGive;
        tokenAmount = amountGet;
      } else {
        etherAmount = amountGet;
        tokenAmount = amountGive;
      }

      let tokenPrice = etherAmount.toNumber() / tokenAmount.toNumber();
      tokenPrice = Math.round(tokenPrice * precision) / precision;

      const dateTime = fromUnixTime(timestamp.toNumber());

      return {
        tokenGive,
        amountGet,
        amountGive,
        id,
        timestamp,
        tokenGet,
        orderType,
        etherAmount,
        tokenAmount,
        tokenPrice,
        dateTime,
      } as MakeOrderEventEnhanced;
    });

    events = events.sort((a, b) => b.tokenPrice - a.tokenPrice);

    const buyOrders = events.filter(
      (event: MakeOrderEventEnhanced) => event.orderType === "buy"
    );
    const sellOrders = events.filter(
      (event: MakeOrderEventEnhanced) => event.orderType === "sell"
    );

    return [events, buyOrders, sellOrders];
  }, [state.events.trades]);

  return makeOrderEvents;
}

export default useMakeOrderEvents;
export type { MakeOrderEventEnhanced };
