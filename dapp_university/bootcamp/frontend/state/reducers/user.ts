const userTypes = {
  ADD_WALLET: "ADD_WALLET",
  REMOVE_WALLET: "REMOVE_WALLET",
  ADD_CHAIN: "ADD_CHAIN",
  REMOVE_CHAIN: "REMOVE_CHAIN",
};

const userReducer = (state, action = {}) => {
  const { data, type } = action;

  switch (type) {
    case userTypes.ADD_WALLET: {
      return {
        ...state,
        user: { ...state.user, ...data },
      };
    }

    case userTypes.REMOVE_WALLET: {
      return {
        ...state,
        user: { ...state.user, account: null },
      };
    }

    case userTypes.ADD_CHAIN: {
      return {
        ...state,
        user: { ...state.user, ...data },
      };
    }

    case userTypes.REMOVE_CHAIN: {
      return {
        ...state,
        user: { ...state.user, chain: null },
      };
    }

    default:
      return state;
  }
};

export { userReducer as default, userTypes };
