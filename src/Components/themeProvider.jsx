import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext()

export function ThemeProvider({ children, defaultTheme = "system" }) {
  const [theme, setTheme] = useState(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const savedTheme = localStorage.getItem("theme")
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    
    if (savedTheme) {
      setTheme(savedTheme)
    } else if (defaultTheme === "system") {
      setTheme(systemDark ? "dark" : "light")
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const root = document.documentElement
    root.classList.remove("light", "dark")
    
    const effectiveTheme = theme === "system" 
      ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      : theme
      
    root.classList.add(effectiveTheme)
    root.setAttribute("data-theme", effectiveTheme)
    localStorage.setItem("theme", theme)
  }, [theme, mounted])

  const value = {
    theme,
    setTheme,
    mounted
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}