import { useEffect } from "react";
import useAppState from "../state";
import { useProvider } from "wagmi";

function useLoadMakeOrderEvents() {
  const [state] = useAppState();
  const provider = useProvider();

  const exchangeContract = state.contracts?.exchangeContract;

  useEffect(() => {
    async function loadEvents() {
      if (!exchangeContract) return;

      const eventFilter = exchangeContract.filters.MakeOrderEvent();
      const events = await exchangeContract
        .connect(provider)
        .queryFilter(eventFilter);

      console.log("MakeOrderEvent", events);
    }

    if (exchangeContract) {
      loadEvents();
    }
  }, [exchangeContract, provider]);
}

function useLoadCancelOrderEvents() {
  const [state] = useAppState();
  const provider = useProvider();

  const exchangeContract = state.contracts?.exchangeContract;

  useEffect(() => {
    async function loadEvents() {
      if (!exchangeContract) return;

      const eventFilter = exchangeContract.filters.CancelOrderEvent();
      const fromBlock = 0;
      const toBlock = "latest";

      const events = await exchangeContract
        .connect(provider)
        .queryFilter(eventFilter, fromBlock, toBlock);

      console.log("CancelOrderEvent", events);
    }

    if (exchangeContract) {
      loadEvents();
    }
  }, [exchangeContract, provider]);
}

function useLoadTradeOrderEvents() {
  const [state] = useAppState();
  const provider = useProvider();

  const exchangeContract = state.contracts?.exchangeContract;

  useEffect(() => {
    async function loadEvents() {
      if (!exchangeContract) return;

      const eventFilter = exchangeContract.filters.TradeEvent();
      const fromBlock = 0;
      const toBlock = "latest";

      const events = await exchangeContract
        .connect(provider)
        .queryFilter(eventFilter, fromBlock, toBlock);

      console.log("TradeEvent", events);
    }

    if (exchangeContract) {
      loadEvents();
    }
  }, [exchangeContract, provider]);
}

export {
  useLoadMakeOrderEvents,
  useLoadCancelOrderEvents,
  useLoadTradeOrderEvents,
};
