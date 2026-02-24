import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import * as LanguageDetectorModule from "i18next-browser-languagedetector";

import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import thCommon from "./locales/th/common.json";
import thAuth from "./locales/th/auth.json";

const i18n = createInstance();
const LanguageDetector =
  ((LanguageDetectorModule as { default?: unknown }).default ??
    LanguageDetectorModule) as unknown as Parameters<typeof i18n.use>[0];
const unwrap = <T,>(mod: T | { default: T } | undefined): T =>
  ((mod as { default?: T } | undefined)?.default ?? (mod as T));

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources: {
    en: {
      common: unwrap(enCommon),
      auth: unwrap(enAuth),
    },
    th: {
      common: unwrap(thCommon),
      auth: unwrap(thAuth),
    },
  },
  fallbackLng: "en",
  defaultNS: "common",
  initImmediate: false,
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
  },
});

export default i18n;
