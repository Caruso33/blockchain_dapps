const eventTypes = {
  ADD_MAKE_ORDERS: "ADD_MAKE_ORDERS",
  ADD_CANCEL_ORDERS: "ADD_CANCEL_ORDERS",
  ADD_TRADES: "ADD_TRADES",
};

const eventsReducer = (state, action = {}) => {
  const { data, type } = action;

  switch (type) {
    case eventTypes.ADD_MAKE_ORDERS: {
      return {
        ...state,
        events: {
          ...state.events,
          makeOrders: [...state.events.makeOrders, ...data],
        },
      };
    }

    case eventTypes.ADD_CANCEL_ORDERS: {
      return {
        ...state,
        events: {
          ...state.events,
          cancelOrders: [...state.events.cancelOrders, ...data],
        },
      };
    }

    case eventTypes.ADD_TRADES: {
      return {
        ...state,
        events: {
          ...state.events,
          trades: [...state.events.trades, ...data],
        },
      };
    }

    default:
      return state;
  }
};

export { eventsReducer as default, eventTypes };
