import type { Decorator } from "@storybook/react-vite";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n/i18n";
import { Suspense, useEffect } from "react";

export const LanguageDecorator: Decorator = (Story, context) => {
  const { locale } = context.globals;

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  return (
    <Suspense fallback={<></>}>
      <I18nextProvider i18n={i18n}>
        <Story {...context} />
      </I18nextProvider>
    </Suspense>
  );
};
