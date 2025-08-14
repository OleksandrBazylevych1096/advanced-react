import { Suspense, useEffect } from "react";

import { refreshSession, userActions } from "@/entities/user";

import { setAuthFailureHandler } from "@/shared/api";
import { useAppDispatch } from "@/shared/lib";

import { AppRouter } from "./providers";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(userActions.initUserData());
    dispatch(refreshSession());
    setAuthFailureHandler(() => {
      dispatch(userActions.clearUserData());
    });
  }, [dispatch]);

  return (
    <Suspense fallback={<></>}>
      <AppRouter />
    </Suspense>
  );
}

export default App;
