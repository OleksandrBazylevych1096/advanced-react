import type { ReducersMapObject } from "@reduxjs/toolkit";
import type { Decorator } from "@storybook/react-vite";

import { StoreProvider } from "@/app/providers";
import type { StateSchema } from "@/app/store";

import type { DeepPartial } from "@/shared/lib";

export const StoreDecorator: Decorator = (Story, context) => {
  const parameters = context.parameters as {
    initialState?: Partial<StateSchema>;
    asyncReducers?: DeepPartial<ReducersMapObject<StateSchema>>;
  };

  const asyncReducers = parameters?.asyncReducers;
  const initialState = parameters?.initialState as StateSchema | undefined;

  return (
    <StoreProvider initialState={initialState} asyncReducers={asyncReducers}>
      <Story {...context} />
    </StoreProvider>
  );
};
