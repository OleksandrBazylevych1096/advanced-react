import {initialize, mswLoader} from 'msw-storybook-addon';

import {handlers} from '../src/features/manageAddress/lib/test/handlers';

// Initialize MSW
initialize({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
    serviceWorker: {
        url: '/mockServiceWorker.js',
    },
});

// Add MSW loader to preview
export const loaders = [mswLoader];

// Default MSW handlers for all stories
export const parameters = {
    msw: {
        handlers: handlers,
    },
};

export default {
    loaders,
    parameters,
};