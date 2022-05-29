const contractsReducer = (state, action = {}) => {
  const { data, type } = action;

  switch (type) {
    case "CONTRACTS": {
      return {
        ...state,
        contracts: { ...state.contracts, ...data },
      };
    }
    default:
      return state;
  }
};

export default contractsReducer;
