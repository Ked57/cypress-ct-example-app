import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { DarkModeProvider } from "./utils/useDarkMode";

export const App = ({ darkModeParameter }) => {
  console.log(darkModeParameter);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") || darkModeParameter
  );
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark", "bg-gray-800");
      return;
    }
    document.body.classList.remove("dark", "bg-gray-800");
  }, [darkMode]);
  return (
    <DarkModeProvider
      value={{
        darkMode,
        setDarkMode: (value) => {
          setDarkMode(value);
          localStorage.setItem("darkMode", value);
        },
      }}
    >
      <Outlet />
    </DarkModeProvider>
  );
};
