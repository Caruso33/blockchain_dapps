import { useMemo } from "react"
import useAppState from "../../../state"
import { CancelOrderEvent } from "../../../types"

function useCancelOrderEvents() {
  const [state] = useAppState()

  const cancelOrderEvents = useMemo(() => {
    if (!state?.events?.cancelOrders) return []

    let events = state.events.cancelOrders.map(
      (cancelOrderEvent: CancelOrderEvent) => {
        const { id, user, timestamp } = cancelOrderEvent

        return { id, user, timestamp } as CancelOrderEvent
      }
    )

    return events
  }, [state.events.cancelOrders])

  return cancelOrderEvents
}

export default useCancelOrderEvents
export type { CancelOrderEvent }
