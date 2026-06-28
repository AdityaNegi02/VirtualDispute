import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;