import type {Decorator} from "@storybook/react-vite";
import {MemoryRouter, Route, Routes} from "react-router";

export const RouterDecorator: Decorator = (Story, context) => {
    const parameters = context.parameters as {
        route?: string;
        routePath?: string;
    };
    const route = parameters.route || "/";
    const path = parameters.routePath || "*";

    return (
        <MemoryRouter initialEntries={[route]}>
            <Routes>
                <Route path={path} element={<Story {...context} />}/>
            </Routes>
        </MemoryRouter>
    );
};