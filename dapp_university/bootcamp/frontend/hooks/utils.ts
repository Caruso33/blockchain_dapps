import { Contract } from "ethers";
import { eventTypes } from "../state/reducers/events";

async function loadEvents(exchangeContract: Contract, eventName: string) {
  if (!exchangeContract) return;

  const eventFilter = exchangeContract.filters[eventName]();
  const fromBlock = 0;
  const toBlock = "latest";

  const events = await exchangeContract.queryFilter(
    eventFilter,
    fromBlock,
    toBlock
  );

  console.log(`Got ${events?.length} ${eventName}`);

  return events;
}

async function loadMakeOrderEvents(exchangeContract: Contract, dispatch: any) {
  const events = await loadEvents(exchangeContract, "MakeOrderEvent");
  dispatch({ type: eventTypes.ADD_MAKE_ORDERS, data: events });
}

async function loadCancelOrderEvents(
  exchangeContract: Contract,
  dispatch: any
) {
  const events = await loadEvents(exchangeContract, "CancelOrderEvent");
  dispatch({ type: eventTypes.ADD_CANCEL_ORDERS, data: events });
}

async function loadTradeEvents(exchangeContract: Contract, dispatch: any) {
  const events = await loadEvents(exchangeContract, "TradeEvent");
  dispatch({ type: eventTypes.ADD_TRADES, data: events });
}

export {
  loadEvents,
  loadMakeOrderEvents,
  loadCancelOrderEvents,
  loadTradeEvents,
};
