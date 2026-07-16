import { useEffect, useState } from "react";

const KEY = "epidemiqs-theme";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  useEffect(() => {
    const stored = (typeof window !== "undefined" ? localStorage.getItem(KEY) : null) as
      | "light"
      | "dark"
      | null;
    const initial = stored ?? "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);
  const toggle = () => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem(KEY, next);
      return next;
    });
  };
  return { theme, toggle };
}
