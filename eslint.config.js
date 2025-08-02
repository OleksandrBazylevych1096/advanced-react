// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";
import featureSliced from "@conarti/eslint-plugin-feature-sliced";
import importPlugin from "eslint-plugin-import";
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

export default tseslint.config(
  [
    globalIgnores(["dist"]),
    {
      plugins: {
        "@conarti/feature-sliced": featureSliced,
        import: importPlugin,
      },
      files: ["**/*.{ts,tsx}"],
      extends: [
        js.configs.recommended,
        tseslint.configs.recommended,
        reactHooks.configs["recommended-latest"],
        reactRefresh.configs.vite,
      ],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
      },
      rules: {
        ...featureSliced.configs.recommended.rules,
        "import/order": [
          "error",
          {
            groups: [
              "builtin",
              "external",
              "internal",
              "parent",
              "sibling",
              "index",
            ],
            pathGroups: [
              {
                pattern: "@/app/**",
                group: "internal",
                position: "before",
              },
              {
                pattern: "@/pages/**",
                group: "internal",
                position: "before",
              },
              {
                pattern: "@/widgets/**",
                group: "internal",
                position: "before",
              },
              {
                pattern: "@/features/**",
                group: "internal",
                position: "before",
              },
              {
                pattern: "@/entities/**",
                group: "internal",
                position: "before",
              },
              {
                pattern: "@/shared/**",
                group: "internal",
                position: "before",
              },
            ],
            pathGroupsExcludedImportTypes: ["builtin"],
            "newlines-between": "always",
            alphabetize: {
              order: "asc",
              caseInsensitive: true,
            },
          },
        ],

        "import/first": "error",
        "import/newline-after-import": "error",
        "import/no-duplicates": "error",
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
          },
        ],
      },
    },
  ],
  storybook.configs["flat/recommended"]
);
