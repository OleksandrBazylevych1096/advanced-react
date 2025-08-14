import type { ReactNode } from "react";
import { Provider } from "react-redux";

import { createStore, type StateSchema } from "@/app/store";

interface StoreProviderProps {
  children: ReactNode;
  initialState?: StateSchema;
}

export const StoreProvider = (props: StoreProviderProps) => {
  const { children, initialState } = props;
  const store = createStore(initialState);
  return <Provider store={store}>{children}</Provider>;
};
