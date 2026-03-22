import type {ReactNode} from "react";
import {createPortal} from "react-dom";

import {PROJECT_ENV,THEME_DECORATOR_CONTAINER_ID} from "@/shared/config";

interface PortalProps {
    children: ReactNode;
    container?: HTMLElement;
}

export const Portal = (props: PortalProps) => {
    const {children, container: containerProp = document.body} = props;

    let container = containerProp;

    if (PROJECT_ENV === "storybook") {
        const newContainer = document.getElementById(THEME_DECORATOR_CONTAINER_ID);

        if (newContainer !== null) {
            container = newContainer;
        }
    }

    return createPortal(children, container);
};
