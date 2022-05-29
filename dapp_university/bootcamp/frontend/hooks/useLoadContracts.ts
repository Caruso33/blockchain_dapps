import { useEffect } from "react";
import getContracts from "../components/index/getContracts";
import useAppState from "../state";
import { contractTypes } from "../state/reducers/contracts";

function useLoadContracts() {
  const [state, dispatch] = useAppState();

  useEffect(() => {
    function handleContractsData(value: object) {
      dispatch({ type: contractTypes.CHANGE_CONTRACTS, data: value });
    }

    async function loadContracts() {
      const contracts = await getContracts(state.user?.chain?.id);

      if (contracts) handleContractsData(contracts);
    }

    const hasChain = state.user?.chain?.id;
    if (hasChain && !state.contracts.contractData) {
      loadContracts();
    }

    // if (state.user?.chain?.id === undefined) {
    //   dispatch({ type: contractTypes.CHANGE_CONTRACTS, data: value });
    // }
  }, [dispatch, state]);
}

export default useLoadContracts;
