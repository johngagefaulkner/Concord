import { useState, useEffect } from 'react';
type Theme = 'light-concord' | 'dark-concord';
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('concord-theme') as Theme | null;
    return savedTheme || 'dark-concord';
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light-concord') {
      root.classList.remove('dark-concord');
      root.classList.add('light-concord');
    } else {
      root.classList.remove('light-concord');
      root.classList.add('dark-concord');
    }
    localStorage.setItem('concord-theme', theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark-concord' ? 'light-concord' : 'dark-concord'));
  };
  return { theme, toggleTheme };
}