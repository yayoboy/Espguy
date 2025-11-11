import { useEffect } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { useThemeStore } from '@/store/useThemeStore'
import Dashboard from '@/components/Dashboard'

function App() {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  return (
    <>
      <Dashboard />
      <Toaster />
    </>
  )
}

export default App
