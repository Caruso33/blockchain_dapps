const contractTypes = {
  CHANGE_CONTRACTS: "CHANGE_CONTRACTS",
};

const contractsReducer = (state, action = {}) => {
  const { data, type } = action;

  switch (type) {
    case "CHANGE_CONTRACTS": {
      return {
        ...state,
        contracts: { ...state.contracts, ...data },
      };
    }
    default:
      return state;
  }
};

export { contractsReducer as default, contractTypes };
