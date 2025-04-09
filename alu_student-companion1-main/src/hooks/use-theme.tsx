
import { useState, useEffect } from "react";

type Theme = "dark" | "light" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme") as Theme;
    return saved || "system";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    
    const effectiveTheme = theme === "system" ? systemTheme : theme;
    
    root.classList.remove("light", "dark");
    root.classList.add(effectiveTheme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
