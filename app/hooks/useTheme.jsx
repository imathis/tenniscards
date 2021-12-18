import React from 'react'

const ThemeContext = React.createContext()
const useTheme = () => React.useContext(ThemeContext)

const ThemeProvider = (props) => {
  const [theme, setTheme] = React.useState('default')

  React.useLayoutEffect(() => {
    const app = document.querySelector('#root')
    app.dataset.theme = theme
  }, [theme])

  const value = React.useMemo(() => ({
    theme,
    setTheme,
  }), [theme])

  return <ThemeContext.Provider {...props} value={value} />
}

export {
  ThemeProvider,
  useTheme,
}
