import { createContext, useContext } from "react";

const DarkModeContext = createContext(undefined);

export const DarkModeProvider = ({
  children,
  value: { darkMode, setDarkMode },
}) => (
  <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
    {children}
  </DarkModeContext.Provider>
);

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};
