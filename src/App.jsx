import { useState } from "react";
import "./App.css";
import { DarkModeSelector } from "./components/DarkModeSelector";
import { DarkModeProvider } from "./utils/useDarkMode";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <DarkModeProvider value={{ darkMode, setDarkMode }}>
      <DarkModeSelector />
    </DarkModeProvider>
  );
}

export default App;
