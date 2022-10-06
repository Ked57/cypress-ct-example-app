import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    darkMode: {
      switchToLightMode: "Switch to lightmode",
      switchToDarkMode: "Switch to darkmode",
    },
    productsPage: {
      categories: {
        loading: "Loading categories...",
        failure: "Failed to load categories",
      },
      products: {
        loading: "Loading products...",
        failure: "Failed to load products",
      },
    },
    productPreview: {
      rating: "{{rate}} rating for {{count}} reviews",
    },
  },
  fr: {
    darkMode: {
      switchToLightMode: "Passer au lightmode",
      switchToDarkMode: "Passer au darkmode",
    },
    productsPage: {
      categories: {
        loading: "Chargement des catégories...",
        failure: "Erreur lors du chargement des catégories",
      },
      products: {
        loading: "Chargement des produits...",
        failure: "Erreur lors du chargement des produits",
      },
    },
    productPreview: {
      rating: "{{rate}} note moyenne pour {{count}} notes",
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
