import type {Decorator} from "@storybook/react-vite";

export const THEME_DECORATOR_CONTAINER_ID = 'Theme_Decorator_Container_Id'

export const ThemeDecorator: Decorator = (Story, context) => {
    const {theme} = context.globals;
    return (
        <div id={THEME_DECORATOR_CONTAINER_ID} className={theme}>
            <Story {...context} />
        </div>
    );
};
