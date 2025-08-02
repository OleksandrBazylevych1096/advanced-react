import { Suspense } from "react";
import { AppRouter } from "./providers";

function App() {
  return (
    <Suspense fallback={<></>}>
      <AppRouter />
    </Suspense>
  );
}

export default App;
