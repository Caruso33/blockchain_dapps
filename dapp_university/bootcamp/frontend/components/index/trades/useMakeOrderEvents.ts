import fromUnixTime from "date-fns/fromUnixTime";
import { BigNumber, ethers, Event } from "ethers";
import { useMemo } from "react";
import useAppState from "../../../state";
import useCancelOrderEvents, { CancelOrderEvent } from "./useCancelOrderEvents";
import useTradeEvents, { TradeEventEnhanced } from "./useTradeEvents";

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

  const cancelOrderEvents = useCancelOrderEvents();
  const [tradeEvents] = useTradeEvents();

  const makeOrderEvents = useMemo(() => {
    if (!state?.events?.trades) return [];

    const precision = 10 ** 5;
    let events: Array<MakeOrderEventEnhanced> = state.events.makeOrders.map(
      (trade: Event) => {
        const makeOrderEventArgs = trade.args as unknown as MakeOrderEvent;
        return makeOrderEventArgs;
      }
    );

    events = events.map((makeOrderEvent: MakeOrderEvent) => {
      const { tokenGive, amountGet, amountGive, id } = makeOrderEvent;
      const { timestamp, tokenGet, user } = makeOrderEvent;

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
        user,
        timestamp,
        tokenGet,
        orderType,
        etherAmount,
        tokenAmount,
        tokenPrice,
        dateTime,
      } as MakeOrderEventEnhanced;
    });

    events = events.filter((event: MakeOrderEventEnhanced) => event.tokenPrice);

    const cancelledAndFilledIds = [...cancelOrderEvents, ...tradeEvents].map(
      (event: CancelOrderEvent | TradeEventEnhanced) => event.id.toNumber()
    );

    events = events.filter(
      (event: MakeOrderEventEnhanced) =>
        !cancelledAndFilledIds.includes(event.id.toNumber())
    );

    events = events.sort((a, b) => b.tokenPrice - a.tokenPrice);

    const buyOrders = events.filter(
      (event: MakeOrderEventEnhanced) => event.orderType === "buy"
    );
    const sellOrders = events.filter(
      (event: MakeOrderEventEnhanced) => event.orderType === "sell"
    );

    const myOrders = events.filter(
      (event: MakeOrderEventEnhanced) =>
        event.user === state.user.account.address
    );

    return [events, buyOrders, sellOrders, myOrders];
  }, [
    state.events.trades,
    state.events.makeOrders,
    state.user.account.address,
    cancelOrderEvents,
    tradeEvents,
  ]);

  return makeOrderEvents;
}

export default useMakeOrderEvents;
export type { MakeOrderEventEnhanced };
