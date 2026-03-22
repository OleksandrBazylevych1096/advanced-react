import {Suspense} from "react";

import {PageLoader} from "@/widgets/PageLoader";

import {useInitializeApp} from "./init/useInitializeApp.ts";
import {AppRouter} from "./providers/router/AppRouter";

function App() {
    useInitializeApp();

    return (
        <Suspense fallback={<PageLoader />}>
            <AppRouter />
        </Suspense>
    );
}

export default App;
