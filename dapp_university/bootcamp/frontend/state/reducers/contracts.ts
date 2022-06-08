const contractTypes = {
  CHANGE_CONTRACTS: "CHANGE_CONTRACTS",
  REMOVE_CONTRACTS: "REMOVE_CONTRACTS",
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

    case "REMOVE_CONTRACTS": {
      return {
        ...state,
        contracts: {},
      };
    }

    default:
      return state;
  }
};

export { contractsReducer as default, contractTypes };
