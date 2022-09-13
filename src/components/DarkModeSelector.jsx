import { useDarkMode } from "../utils/useDarkMode";

export const DarkModeSelector = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  return (
    <button onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? "Switch to lightmode" : "Switch to darkmode"}
    </button>
  );
};
