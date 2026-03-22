import type {ReducersMapObject} from "@reduxjs/toolkit";
import {render} from "@testing-library/react";
import type {ReactNode} from "react";
import {I18nextProvider} from "react-i18next";
import {MemoryRouter, Route, Routes} from "react-router";

import {StoreProvider} from "@/app/providers/StoreProvider/StoreProvider";

import {i18nForTests} from "@/shared/config/test";
import type {DeepPartial} from "@/shared/lib/state/redux/types";

interface RenderWithProvidersOptions {
    route?: string;
    path?: string;
    initialState?: StateSchema;
    asyncReducers?: DeepPartial<ReducersMapObject<StateSchema>>;
}

export const renderWithProviders = (
    ui: ReactNode,
    {route = "/", path = "*", initialState, asyncReducers = {}}: RenderWithProvidersOptions = {},
) => {
    return render(
        <StoreProvider initialState={initialState} asyncReducers={asyncReducers}>
            <MemoryRouter initialEntries={[route]}>
                <I18nextProvider i18n={i18nForTests}>
                    <Routes>
                        <Route path={path} element={ui} />
                    </Routes>
                </I18nextProvider>
            </MemoryRouter>
        </StoreProvider>,
    );
};
