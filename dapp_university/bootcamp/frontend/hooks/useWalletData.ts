import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";
import useAppState from "../state";
import { actionTypes } from "../state/reducer";

function useWalletData() {
  const [state, dispatch] = useAppState();

  const { data } = useAccount();
  const { activeChain } = useNetwork();

  useEffect(() => {
    const handleWalletData = (value: object) => {
      dispatch({ type: actionTypes.ADD_WALLET, data: { account: value } });
    };

    if (data?.address !== state.user?.address) {
      if (!data) dispatch({ type: actionTypes.REMOVE_WALLET });
      if (data?.address) handleWalletData(data);
    }
  }, [data, state, dispatch]);

  useEffect(() => {
    const handleChainData = (value: object) => {
      dispatch({ type: actionTypes.ADD_CHAIN, data: { chain: value } });
    };

    if (activeChain !== state.user?.activeChain) {
      if (!activeChain) dispatch({ type: actionTypes.REMOVE_CHAIN });
      if (activeChain) handleChainData(activeChain);
    }
  }, [activeChain, state, dispatch]);
}

export default useWalletData;
