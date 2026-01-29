import type {StorybookConfig} from "@storybook/react-vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@chromatic-com/storybook",
        "@storybook/addon-docs",
        "@storybook/addon-a11y",
        "@storybook/addon-vitest",
    ],
    env: (config) => ({
        ...config,
        VITE_PROJECT_ENV: "storybook",
        VITE_API_URL: 'http://localhost:3000'

    }),
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
};
export default config;
