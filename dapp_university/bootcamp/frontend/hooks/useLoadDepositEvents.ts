import { useEffect } from "react";
import useAppState from "../state";
import { useProvider } from "wagmi";

function useLoadDepositEvents() {
  const [state] = useAppState();
  const provider = useProvider();

  const exchangeContract = state.contracts?.exchangeContract;

  useEffect(() => {
    async function loadEvents() {
      if (!exchangeContract) return;

      const eventFilter = exchangeContract.filters.DepositEvent();
      const events = await exchangeContract
        .connect(provider)
        .queryFilter(eventFilter);

      console.log("DepositEvent", events);
    }

    if (exchangeContract) {
      loadEvents();
    }
  }, [exchangeContract, provider]);
}

function useLoadWithdrawalEvents() {
  const [state] = useAppState();
  const provider = useProvider();

  const exchangeContract = state.contracts?.exchangeContract;

  useEffect(() => {
    async function loadEvents() {
      if (!exchangeContract) return;

      const eventFilter = exchangeContract.filters.WithdrawalEvent();
      const fromBlock = 0;
      const toBlock = "latest";

      const events = await exchangeContract
        .connect(provider)
        .queryFilter(eventFilter, fromBlock, toBlock);

      console.log("WithdrawalEvent", events);
    }

    if (exchangeContract) {
      loadEvents();
    }
  }, [exchangeContract, provider]);
}

export { useLoadDepositEvents, useLoadWithdrawalEvents };
