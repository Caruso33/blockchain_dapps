import { CancelOrderEvent } from "../../types"

const eventTypes = {
  ADD_MAKE_ORDERS: "ADD_MAKE_ORDERS",
  ADD_CANCEL_ORDERS: "ADD_CANCEL_ORDERS",
  ADD_CANCEL_ORDER: "ADD_CANCEL_ORDER",
  ADD_TRADES: "ADD_TRADES",
  ADD_DEPOSITS: "ADD_DEPOSITS",
  ADD_WITHDRAWALS: "ADD_WITHDRAWALS",
}

const eventsReducer = (state, action = {}) => {
  const { data, type } = action

  switch (type) {
    case eventTypes.ADD_MAKE_ORDERS: {
      return {
        ...state,
        events: {
          ...state.events,
          makeOrders: [...state.events.makeOrders, ...data],
        },
      }
    }

    case eventTypes.ADD_CANCEL_ORDERS: {
      return {
        ...state,
        events: {
          ...state.events,
          cancelOrders: [...state.events.cancelOrders, ...data],
        },
      }
    }

    case eventTypes.ADD_CANCEL_ORDER: {
      const cancelOrders = state.events.cancelOrders

      if (
        !cancelOrders.find(
          (order: CancelOrderEvent) =>
            order.id.toString() === data.id.toString()
        )
      ) {
        cancelOrders.push(data)
      }

      return {
        ...state,
        events: {
          ...state.events,
          cancelOrders,
        },
      }
    }

    case eventTypes.ADD_TRADES: {
      return {
        ...state,
        events: {
          ...state.events,
          trades: [...state.events.trades, ...data],
        },
      }
    }

    case eventTypes.ADD_DEPOSITS: {
      return {
        ...state,
        events: {
          ...state.events,
          deposits: [...state.events.deposits, ...data],
        },
      }
    }

    case eventTypes.ADD_WITHDRAWALS: {
      return {
        ...state,
        events: {
          ...state.events,
          withdrawals: [...state.events.withdrawals, ...data],
        },
      }
    }

    default:
      return state
  }
}

export { eventsReducer as default, eventTypes }
