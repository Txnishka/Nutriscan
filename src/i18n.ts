import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(initReactI18next) // passes i18n to react-i18next
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language
    supportedLngs: ['en', 'hi', 'mr'], // supported languages
    interpolation: {
      escapeValue: false, // react already escapes by default
    },
    react: {
      useSuspense: false, // set to true if you use Suspense
    },
    debug: process.env.NODE_ENV === 'development', // enable debug in development
  });

export default i18n; 