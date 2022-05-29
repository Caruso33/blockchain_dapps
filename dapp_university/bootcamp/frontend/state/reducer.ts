import userReducer from "./reducers/user";
import contractsReducer from "./reducers/contracts";

const initialState = {
  user: {},
  contracts: {},
};

const combineReducers = (reducers: object) => {
  return (state: object, action: () => {}) => {
    return Object.keys(reducers).reduce((acc, prop) => {
      return {
        ...acc,
        ...reducers[prop]({ [prop]: acc[prop] }, action),
      };
    }, state);
  };
};

const appReducers = combineReducers({
  user: userReducer,
  contracts: contractsReducer,
});

export { initialState, combineReducers, appReducers };
