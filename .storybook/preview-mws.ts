import {initialize, mswLoader} from 'msw-storybook-addon';

/**
 * Initialize MSW for Storybook
 */
initialize({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
    serviceWorker: {
        url: '/mockServiceWorker.js',
    },
});

/**
 * Add MSW loader to all stories
 */
export const loaders = [mswLoader];

export default {
    loaders,
};