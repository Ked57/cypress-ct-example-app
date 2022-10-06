import { useTranslation } from "react-i18next";
import { useDarkMode } from "../utils/useDarkMode";

export const DarkModeSelector = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  const { t } = useTranslation("darkMode");
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-1 m-2 rounded-md shadow-lg dark:shadow-sm dark:shadow-gray-500 cursor-pointer dark:bg-gray-500"
    >
      {darkMode ? t("switchToLightMode") : t("switchToDarkMode")}
    </button>
  );
};
