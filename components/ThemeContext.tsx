import React, { createContext, useContext, useState, ReactNode } from 'react';

const lightTheme = {
  mode: 'light',
  background: '#f2e9e4',
  card: '#fff',
  text: '#22223b',
  accent: '#4a4e69',
  border: '#c9ada7',
  shadow: '#22223b',
  icon: '#4a4e69',
  inactive: '#9a8c98',
};

const darkTheme = {
  mode: 'dark',
  background: '#22223b',
  card: '#2d3142',
  text: '#f2e9e4',
  accent: '#9a8c98',
  border: '#4a4e69',
  shadow: '#000',
  icon: '#f2e9e4',
  inactive: '#9a8c98',
};

const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setTheme((prev) => (prev.mode === 'light' ? darkTheme : lightTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
} 