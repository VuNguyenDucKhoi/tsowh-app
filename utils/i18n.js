import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import localesResource from "../src/i18n";
import * as Localization from "expo-localization";

const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: (callback) => {
    // We will get back a string like "en-US". We
    // return a string like "en" to match our language
    // files.
    callback(Localization.locale.split("-")[0]);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(reactI18nextModule)
  .use(languageDetector)
  .init({
    compatibilityJSON: "v3",
    resources: localesResource,
    fallbackLng: "vi",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    react: {
      wait: true,
    },
  });

export default i18n;
