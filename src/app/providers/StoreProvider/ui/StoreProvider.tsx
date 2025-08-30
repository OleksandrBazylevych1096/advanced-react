import type { ReducersMapObject } from "@reduxjs/toolkit";
import type { ReactNode } from "react";
import { Provider } from "react-redux";

import { createStore, type StateSchema } from "@/app/store";

import type { DeepPartial } from "@/shared/lib";

interface StoreProviderProps {
  children: ReactNode;
  initialState?: StateSchema;
  asyncReducers?: DeepPartial<ReducersMapObject<StateSchema>>;
}

export const StoreProvider = (props: StoreProviderProps) => {
  const { children, initialState, asyncReducers } = props;
  const store = createStore(initialState, asyncReducers);
  return <Provider store={store}>{children}</Provider>;
};
