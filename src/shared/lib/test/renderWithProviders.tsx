import type {ReducersMapObject} from "@reduxjs/toolkit";
import {render} from "@testing-library/react";
import type {ReactNode} from "react";
import {I18nextProvider} from "react-i18next";
import {MemoryRouter, Route, Routes} from "react-router";

import {StoreProvider} from "@/app/providers";
import type {StateSchema} from "@/app/store";

import i18n from "../../config/i18n/i18nForTests";
import type {DeepPartial} from "../redux/types";

interface RenderWithProvidersOptions {
    route?: string;
    path?: string;
    initialState?: StateSchema;
    asyncReducers?: DeepPartial<ReducersMapObject<StateSchema>>;
}

export const renderWithProviders = (
    ui: ReactNode,
    {
        route = "/",
        path = "*",
        initialState,
        asyncReducers = {}
    }: RenderWithProvidersOptions = {}
) => {
    return render(
        <StoreProvider initialState={initialState} asyncReducers={asyncReducers}>
            <MemoryRouter initialEntries={[route]}>
                <I18nextProvider i18n={i18n}>
                    <Routes>
                        <Route path={path} element={ui}/>
                    </Routes>
                </I18nextProvider>
            </MemoryRouter>
        </StoreProvider>
    );
};


