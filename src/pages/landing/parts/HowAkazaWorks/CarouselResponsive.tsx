import { useState, useEffect } from "react";
import CarouselMobile from "./CarouselMobile";

const CarouselResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Using 1024px as breakpoint
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  return (
    <>
      {isMobile ? <CarouselMobile /> : <CarouselMobile />}
    </>
  );
};

export default CarouselResponsive;