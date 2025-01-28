import { useState } from "react";

export const useCountrySelect = () => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((state) => !state);
  };

  return {
    open,
    handleToggle,
  };
};
