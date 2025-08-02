import type { Preview } from "@storybook/react-vite";

import "../src/app/styles/index.scss";
import {
  ThemeDecorator,
  RouterDecorator,
  LanguageDecorator,
} from "../src/shared/config/storybook";

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "Theme",
      description: " App theme",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "blue-theme", title: "Blue Theme" },
          { value: "pink-theme", title: "Pink Theme" },
        ],
        dynamicTitle: true,
      },
      defaultValue: "pink-theme",
    },
    locale: {
      name: "Locale",
      description: " App locale",
      toolbar: {
        icon: "globe",
        items: [
          { value: "en", title: "English" },
          { value: "de", title: "Deutsch" },
        ],
        dynamicTitle: true,
      },
      defaultValue: "en",
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  decorators: [ThemeDecorator, RouterDecorator, LanguageDecorator],
};

export default preview;
