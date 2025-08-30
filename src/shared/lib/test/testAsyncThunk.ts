import type { AsyncThunk, Dispatch } from "@reduxjs/toolkit";
import { vi } from "vitest";

import type { StateSchema } from "@/app/store";

export async function testAsyncThunk<Returned, Arg, RejectedValue>(
  thunk: AsyncThunk<Returned, Arg, { rejectValue: RejectedValue }>,
  arg: Arg,
  options?: {
    state?: Partial<StateSchema>;
    extra?: unknown;
    dispatch?: Dispatch;
    getState?: () => StateSchema;
  }
) {
  const dispatch = options?.dispatch ?? vi.fn();
  const getState =
    options?.getState ?? vi.fn(() => options?.state as StateSchema);

  const result = await thunk(arg as Arg & undefined)(
    dispatch,
    getState,
    options?.extra
  );

  return { result, dispatch, getState };
}
