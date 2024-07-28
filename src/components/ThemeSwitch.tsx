import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeSwitch: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-switch">
      <label className="switch">
        <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default ThemeSwitch;
