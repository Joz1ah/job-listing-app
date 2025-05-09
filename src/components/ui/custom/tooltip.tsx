// Dynamic content styling for desktop
const contentStyle = {
  maxHeight: "300px",
  overflowY: "auto" as const,
  lineHeight: "1.4",
  whiteSpace: "normal" as const,
};
import React, { useState, useEffect, useRef } from "react";

interface TooltipProps {
  content: string | React.ReactNode;
  delay?: number;
  children: React.ReactNode;
}

const Tooltip = ({ content, delay = 100, children }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Check if on mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Handle mouse events for desktop
  const handleMouseEnter = () => {
    if (isMobile) return;

    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  // Handle touch events for mobile
  const handleTouch = () => {
    if (isVisible) {
      setIsVisible(false);
    } else {
      const id = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      setTimeoutId(id);
    }
  };

  // Handle click outside for mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        tooltipRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    if (isVisible && isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside as any);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside as any);
    };
  }, [isVisible, isMobile]);

  // Mobile tooltip styles
  const mobileTooltipStyle = {
    position: "absolute" as const,
    bottom: "100%",
    left: "-100px",
    width: "200px",
    marginBottom: "8px",
    zIndex: 100,
    backgroundColor: "white",
    border: "1px solid #ddd",
    padding: "8px 12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    fontSize: "12px", // Smaller text for mobile
    color: "#263238",
    borderRadius: "0",
  };

  // Desktop tooltip styles
  const desktopTooltipStyle = {
    position: "absolute" as const,
    bottom: "100%", // Position above the element
    left: "0",
    zIndex: 50,
    backgroundColor: "white",
    border: "1px solid #ddd",
    padding: "8px 12px",
    boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
    fontSize: "11px",
    width: "208px",
    marginBottom: "8px", // Space between tooltip and element
    color: "#263238",
    borderRadius: "0",
  };

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={isMobile ? handleTouch : undefined}
    >
      {children}

      {isVisible && (
        <div
          ref={tooltipRef}
          style={isMobile ? mobileTooltipStyle : desktopTooltipStyle}
          role="tooltip"
        >
          <div style={contentStyle}>{content}</div>
        </div>
      )}
    </div>
  );
};

export { Tooltip };
