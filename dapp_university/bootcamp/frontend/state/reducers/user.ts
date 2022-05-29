const userTypes = {
  ADD_WALLET: "ADD_WALLET",
  REMOVE_WALLET: "REMOVE_WALLET",
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
        user: {},
      };
    }

    default:
      return state;
  }
};

export { userReducer as default, userTypes };
