import React, { createContext, useReducer, useContext } from "react";
import { object, func } from "prop-types";

const Context = createContext(null);

export function AppStateProvider(props: {
  reducer: object;
  initialState: object;
  children: React.ReactNode;
}) {
  const { reducer, initialState = {}, children } = props;

  const value = useReducer(reducer, initialState);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

AppStateProvider.propTypes = {
  reducer: func,
  initialState: object,
};

export function useAppState() {
  return useContext(Context);
}
