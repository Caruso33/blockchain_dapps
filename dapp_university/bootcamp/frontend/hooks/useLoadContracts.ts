import { useCallback, useEffect, useRef } from "react";
import getContracts from "../components/index/getContracts";
import useAppState from "../state";
import { contractTypes } from "../state/reducers/contracts";

function useLoadContracts() {
  const [state, dispatch] = useAppState();

  const chainId = state.user?.chain?.id;

  const loadContracts = useCallback(async () => {
    const contracts = await getContracts(state.user?.chain?.id);

    if (contracts)
      dispatch({ type: contractTypes.CHANGE_CONTRACTS, data: contracts });
  }, [state.user?.chain?.id, dispatch]);

  const prevChain = useRef(chainId);
  useEffect(() => {
    if (
      chainId !== prevChain.current
      // || (chainId && !state.contracts.contractData)
    ) {
      prevChain.current = chainId;

      if (!chainId) {
        dispatch({ type: contractTypes.REMOVE_CONTRACTS });
      }

      if (chainId) {
        dispatch({ type: contractTypes.REMOVE_CONTRACTS });
        loadContracts();
      }
    }

    // if (state.user?.chain?.id === undefined) {
    //   dispatch({ type: contractTypes.CHANGE_CONTRACTS, data: value });
    // }
  }, [chainId, dispatch, loadContracts]);
}

export default useLoadContracts;
