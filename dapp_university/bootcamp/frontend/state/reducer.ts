import userReducer from "./reducers/user";

const initialState = {
  user: {},
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
});

export { initialState, combineReducers, appReducers };
