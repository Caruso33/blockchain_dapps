import { useEffect } from "react"

import useAppState from "../state"
import { subscribeCancelOrderEvents } from "./subscribeEvents"

function useSubscribeEvents() {
  const [state, dispatch] = useAppState()

  useEffect(() => {
    subscribeCancelOrderEvents(state?.contracts?.exchangeContract, dispatch)
  }, [state?.contracts?.exchangeContract])
}

export default useSubscribeEvents
