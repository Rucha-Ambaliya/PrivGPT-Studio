'use client';

import { useTheme } from './theme-provider';
import { RiMoonClearFill, RiSunFill } from 'react-icons/ri';

export function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {darkMode ? (
        <RiSunFill className="w-5 h-5 text-yellow-400" />
      ) : (
        <RiMoonClearFill className="w-5 h-5 text-gray-800 dark:text-gray-100" />
      )}
    </button>
  );
}
