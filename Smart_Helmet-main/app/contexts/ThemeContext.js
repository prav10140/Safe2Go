"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setIsDark(savedTheme === "dark")
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
  }

  const theme = {
    isDark,
    toggleTheme,
    colors: {
      primary: isDark ? "#00D4AA" : "#00B894",
      secondary: isDark ? "#6C5CE7" : "#A29BFE",
      background: isDark ? "#1A1A1A" : "#FFFFFF",
      surface: isDark ? "#2D2D2D" : "#F8F9FA",
      text: isDark ? "#FFFFFF" : "#2D3436",
      textSecondary: isDark ? "#B2BEC3" : "#636E72",
      border: isDark ? "#3D3D3D" : "#DDD",
      success: "#00B894",
      warning: "#FDCB6E",
      error: "#E17055",
      info: "#74B9FF",
    },
  }

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}
