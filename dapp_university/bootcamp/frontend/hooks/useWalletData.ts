import { useEffect } from "react";
import { useAccount } from "wagmi";
import useAppState from "../state";
import { actionTypes } from "../state/reducer";

function useWalletData() {
  const [state, dispatch] = useAppState();

  const { data } = useAccount();

  useEffect(() => {
    const handleWalletData = (value: object) => {
      dispatch({ type: actionTypes.ADD_WALLET, data: value });
    };

    if (data?.address !== state.user?.address) {
      if (!data) dispatch({ type: actionTypes.REMOVE_WALLET });
      if (data?.address) handleWalletData(data);
    }
  }, [data, state, dispatch]);
}

export default useWalletData;
