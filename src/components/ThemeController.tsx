import { useEffect, useState } from "react";

import { Theme } from "@libs/utils/types";

const ThemeController = () => {
  const [theme, setTheme] = useState<Theme>(localStorage.getItem('theme') as Theme || 'lemonade');
  const toggleTheme = () => {
    setTheme(theme === 'coffee' ? 'lemonade' : 'coffee');
  };

  useEffect(() => {
    const html = document.querySelector('html')
    if (html) {
      html.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  return (
    <label className="swap swap-rotate mx-3">
      <input
        type="checkbox"
        className="theme-controller"
        value="synthwave"
        onChange={toggleTheme}
      />

      <span
        className="swap-off fill-current icon-sun-mini"
      />

      <span
        className="swap-on fill-current icon-moon-mini"
      />
    </label>
  )
}

export default ThemeController;