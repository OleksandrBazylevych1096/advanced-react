import fsd from "@feature-sliced/steiger-plugin";
import {defineConfig} from "steiger";

export default defineConfig([
    ...fsd.configs.recommended,
    {
        ignores: ["**/*.test.*", "**/*.stories.*"],
    },
    {
        files: ["./src/shared/**"],
        rules: {
            "fsd/public-api": "off",
        },
    },

    {
        // TODO - remove after refactoring features
        files: ["./src/**"],
        rules: {
            "fsd/insignificant-slice": "off",
        },
    },
    {
        // Exception for testing files
        files: [
            "./src/shared/config/storybook/decorators/StoreDecorator.tsx",
            "./src/shared/lib/testing/react/renderWithProviders.tsx",
        ],
        rules: {
            "fsd/forbidden-imports": "off",
            "fsd/no-public-api-sidestep": "off",
        },
    },
]);
