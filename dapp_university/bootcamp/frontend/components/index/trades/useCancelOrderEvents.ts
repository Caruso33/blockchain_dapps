import { BigNumber, Event } from "ethers";
import { useMemo } from "react";
import useAppState from "../../../state";

type CancelOrderEvent = {
  id: BigNumber;
  user: string;
};

function useCancelOrderEvents() {
  const [state] = useAppState();

  const cancelOrderEvents = useMemo(() => {
    if (!state?.events?.cancelOrders) return [];

    let events: Array<CancelOrderEvent> = state.events.cancelOrders.map(
      (trade: Event) => {
        const CancelOrderEventArgs = trade.args as unknown as CancelOrderEvent;
        return CancelOrderEventArgs;
      }
    );

    events = events.map((cancelOrderEvent: CancelOrderEvent) => {
      const { id, user } = cancelOrderEvent;

      return {
        id,
        user,
      } as CancelOrderEvent;
    });

    return events;
  }, [state.events.cancelOrders]);

  return cancelOrderEvents;
}

export default useCancelOrderEvents;
export type { CancelOrderEvent };
