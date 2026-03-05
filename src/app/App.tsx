import {Suspense} from "react";

import {useInitializeApp} from "@/app/init/useInitializeApp.ts";

import {AppRouter} from "./providers";

function App() {
    useInitializeApp();

    return (
        <Suspense fallback={<></>}>
            <AppRouter />
        </Suspense>
    );
}

export default App;
