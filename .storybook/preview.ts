import type {Preview} from "@storybook/react-vite";
import {initialize, mswLoader} from 'msw-storybook-addon';

import {LanguageDecorator, RouterDecorator, StoreDecorator, ThemeDecorator} from "../src/shared/config/storybook";

import "../src/app/styles/index.scss";

initialize({
    onUnhandledRequest: 'warn', // Bypass unhandled requests instead of warning
    serviceWorker: {
        url: '/mockServiceWorker.js',
        options: {
            // Don't intercept requests to these paths
            scope: '/',
        },
    },
});

const preview: Preview = {
    initialGlobals: {
        backgrounds: {value: 'light'},
    },
    globalTypes: {
        theme: {
            name: "Theme",
            description: "App theme",
            toolbar: {
                icon: "circlehollow",
                items: [
                    {value: "blue-theme", title: "Blue Theme"},
                    {value: "pink-theme", title: "Pink Theme"},
                ],
                dynamicTitle: true,
            },
            defaultValue: "pink-theme",
        },
        locale: {
            name: "Locale",
            description: "App locale",
            toolbar: {
                icon: "globe",
                items: [
                    {value: "en", title: "English"},
                    {value: "de", title: "Deutsch"},
                ],
                dynamicTitle: true,
            },
            defaultValue: "en",
        },
    },
    parameters: {
        backgrounds: {
            options: {
                dark: {name: 'Dark', value: '#333'},
                light: {name: 'Light', value: '#fff'},
            },
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        a11y: {
            test: "todo",
        },

    },
    decorators: [
        ThemeDecorator,
        RouterDecorator,
        LanguageDecorator,
        StoreDecorator,
    ],
    loaders: [mswLoader],
};

export default preview;