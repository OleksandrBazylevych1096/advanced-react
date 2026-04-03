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
    {
        // Allow direct test data/handler imports between slices in api test modules.
        files: ["./src/**/api/test/handlers.*", "./src/**/api/test/mockData.*"],
        rules: {
            "fsd/no-public-api-sidestep": "off",
        },
    },
]);
