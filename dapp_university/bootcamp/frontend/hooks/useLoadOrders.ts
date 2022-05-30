import { useEffect } from "react";
import useAppState from "../state";
import { useProvider } from "wagmi";

function useLoadOrders() {
  const [state] = useAppState();
  const exchangeContract = state.contracts?.exchangeContract;

  const provider = useProvider();

  useEffect(() => {
    async function loadOrders() {
      const eventFilter = exchangeContract.filters.MakeOrderEvent();
      const events = await exchangeContract
        .connect(provider)
        .queryFilter(eventFilter);

      console.log(events);
    }

    if (exchangeContract) {
      loadOrders();
    }
  }, [exchangeContract, provider]);
}

export default useLoadOrders;
