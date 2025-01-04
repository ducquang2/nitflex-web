import { useEffect, useState } from "react";

const ThemeController = () => {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const html = document.querySelector('html')
    if (html) {
      html.setAttribute('data-theme', theme);
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