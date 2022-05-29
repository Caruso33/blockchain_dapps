import { useEffect } from "react";
import getContracts from "../components/index/getContracts";
import useAppState from "../state";

function useLoadContracts() {
  const [state, dispatch] = useAppState();

  useEffect(() => {
    function handleContractsData(value: object) {
      dispatch({ type: "CONTRACTS", data: value });
    }

    async function init() {
      const contracts = await getContracts();

      if (contracts) handleContractsData(contracts);
    }

    if (state.contracts.contractData === undefined) {
      init();
    }
  }, [dispatch, state]);
}

export default useLoadContracts;
