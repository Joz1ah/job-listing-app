import { FC, ReactElement, useState, useEffect } from 'react'

interface ResponsiveLayoutProps {
  mobileComponent: ReactElement
  desktopComponent: ReactElement
}

const ResponsiveLayout: FC<ResponsiveLayoutProps> = ({ mobileComponent, desktopComponent }) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)') // Adjust the breakpoint as needed
    setIsMobile(mediaQuery.matches)

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches)
    }

    // Using modern event listener methods
    mediaQuery.addEventListener('change', handleMediaQueryChange)

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange)
    }
  }, [])

  return isMobile ? mobileComponent : desktopComponent
}

export { ResponsiveLayout }