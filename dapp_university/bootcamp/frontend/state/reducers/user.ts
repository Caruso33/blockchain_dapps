const userTypes = {
  ADD_WALLET: "ADD_WALLET",
  REMOVE_WALLET: "REMOVE_WALLET",
  ADD_CHAIN: "ADD_CHAIN",
  REMOVE_CHAIN: "REMOVE_CHAIN",
  ADD_BALANCES: "ADD_BALANCES",
};

const userReducer = (state, action = {}) => {
  const { data, type } = action;

  switch (type) {
    case userTypes.ADD_WALLET: {
      return {
        ...state,
        user: { ...state.user, account: { ...state.user.account, ...data } },
      };
    }

    case userTypes.REMOVE_WALLET: {
      return {
        ...state,
        user: { ...state.user, account: {} },
      };
    }

    case userTypes.ADD_CHAIN: {
      return {
        ...state,
        user: { ...state.user, chain: { ...state.user.chain, ...data } },
      };
    }

    case userTypes.REMOVE_CHAIN: {
      return {
        ...state,
        user: { ...state.user, chain: {} },
      };
    }

    case userTypes.ADD_BALANCES: {
      return {
        ...state,
        user: {
          ...state.user,
          balances: {
            ...state.user.balances,
            ...data,
          },
        },
      };
    }

    default:
      return state;
  }
};

export { userReducer as default, userTypes };
