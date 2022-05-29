import { useEffect } from "react";
import useAppState from "../state";
import { useAccount } from "wagmi";

function useWalletData() {
  const [state, dispatch] = useAppState();

  const { data } = useAccount();

  useEffect(() => {
    const handleWalletData = (value: object) => {
      dispatch({ type: "WALLET_ADDRESS", data: value });
    };

    if (data && !state.user?.address) {
      handleWalletData(data);
    }
  }, [data, state, dispatch]);
}

export default useWalletData;
