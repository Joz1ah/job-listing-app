import { useState, useCallback } from 'react';
import { useDispatch } from "react-redux";
import { setIsResetPasswordSuccesful } from "store/modal/modal.slice";

interface UseMenuReturn {
  menuOpen: boolean;
  toggleMenu: () => void;
}

const useMenu = (): UseMenuReturn => {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    dispatch(setIsResetPasswordSuccesful(false))
    setMenuOpen((prevState) => !prevState);
  }, []);

  return { menuOpen, toggleMenu };
};

export { useMenu }