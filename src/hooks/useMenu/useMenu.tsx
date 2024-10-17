import { useState, useCallback } from 'react';

interface UseMenuReturn {
  menuOpen: boolean;
  toggleMenu: () => void;
}

const useMenu = (): UseMenuReturn => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prevState) => !prevState);
  }, []);

  return { menuOpen, toggleMenu };
};

export { useMenu }