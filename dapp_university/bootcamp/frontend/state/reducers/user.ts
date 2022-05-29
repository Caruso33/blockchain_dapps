const userReducer = (state, action = {}) => {
  const { data, type } = action;

  switch (type) {
    case "WALLET_ADDRESS": {
      return {
        ...state,
        user: { ...state.user, ...data },
      };
    }
    default:
      return state;
  }
};

export default userReducer;
