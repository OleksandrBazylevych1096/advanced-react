import type {ReactNode} from "react";
import {createPortal} from "react-dom";

import {THEME_DECORATOR_CONTAINER_ID} from "@/shared/config/storybook/decorators/ThemeDecorator.tsx";

interface PortalProps {
    children: ReactNode;
    container?: HTMLElement;
}

export const Portal = (props: PortalProps) => {
    const {children, container: containerProp = document.body} = props;

    let container = containerProp

    if (import.meta.env.VITE_PROJECT_ENV === 'storybook') {
        const newContainer = document.getElementById(THEME_DECORATOR_CONTAINER_ID)

        if (newContainer !== null) {
            container = newContainer
        }
    }

    return createPortal(children, container);
};
