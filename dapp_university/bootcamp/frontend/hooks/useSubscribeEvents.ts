import { useEffect } from "react";
import { useProvider } from "wagmi";
import { subscribeCancelOrderEvents } from "./subscribeEvents";

function useSubscribeEvents() {
  const provider = useProvider();

  useEffect(() => {
    subscribeCancelOrderEvents(provider);
  }, [provider]);
}

export default useSubscribeEvents;
