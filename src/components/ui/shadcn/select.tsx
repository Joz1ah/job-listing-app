"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-[10px] bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      "border border-gray-300 focus:outline-none data-[state=open]:border-[#F5722E] data-[state=open]:border-2",
      "[&>[data-icon]]:transition-transform [&>[data-icon]]:duration-200",
      "[&[data-state=open]>[data-icon]]:rotate-180",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-100" data-icon />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

// Custom ScrollUpButton that only responds to clicks, not hover
const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className }) => {
  // State to track if button is being held
  const [isPressed, setIsPressed] = React.useState(false);
  // Reference to the interval
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  // Reference to track if this is a holding action
  const isHoldingRef = React.useRef(false);
  // Track whether we're in a continuous scroll
  const isContinuousScrolling = React.useRef(false);

  // Prevent any hover interactions
  const preventHover = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle single click - ensure it only fires once
  const handleClick = (e: React.MouseEvent) => {
    // Only perform click action if we're not in a "holding" state
    if (!isHoldingRef.current) {
      e.preventDefault();
      const viewport = document.querySelector(
        "[data-radix-select-viewport]",
      ) as HTMLElement;
      if (viewport) {
        smoothScroll(viewport, viewport.scrollTop - 40, 150);
      }
    }
  };

  // Smooth scroll function
  const smoothScroll = (
    element: HTMLElement,
    targetPosition: number,
    duration: number,
  ) => {
    const startPosition = element.scrollTop;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const scrollProgress = Math.min(timeElapsed / duration, 1);

      // Easing function for smoother movement
      const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

      element.scrollTop = startPosition + distance * ease(scrollProgress);

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Handle mouse down - start scrolling with delay
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPressed(true);
    isHoldingRef.current = false; // Reset holding state

    // Don't scroll immediately on mouse down - wait to see if it's a click or hold

    // Set up interval with a delay before continuous scrolling starts
    const delayMs = 300; // 300ms delay before continuous scrolling starts

    // Start continuous scrolling after delay
    const timeoutId = setTimeout(() => {
      isHoldingRef.current = true; // Mark as holding action
      isContinuousScrolling.current = true;

      // Initial scroll when holding is confirmed
      const viewport = document.querySelector(
        "[data-radix-select-viewport]",
      ) as HTMLElement;
      if (viewport) {
        smoothScroll(viewport, viewport.scrollTop - 40, 150);
      }

      intervalRef.current = setInterval(() => {
        const viewport = document.querySelector(
          "[data-radix-select-viewport]",
        ) as HTMLElement;
        if (viewport) {
          // Smoother continuous scrolling - smaller increments more frequently
          if (isContinuousScrolling.current) {
            viewport.scrollTop -= 8; // Smaller increment for smoother scrolling
          }
        }
      }, 50); // More frequent updates for smoother motion
    }, delayMs);

    // Store timeout ID to clear it if needed
    intervalRef.current = timeoutId as any;
  };

  // Handle mouse up - stop scrolling
  const handleMouseUp = () => {
    setIsPressed(false);
    // Reset the holding state on mouse up
    isHoldingRef.current = false;
    isContinuousScrolling.current = false;

    if (intervalRef.current) {
      // Clear both timeout and interval
      clearTimeout(intervalRef.current as NodeJS.Timeout);
      clearInterval(intervalRef.current as NodeJS.Timeout);
      intervalRef.current = null;
    }
  };

  // Clean up interval/timeout on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        // Clear both timeout and interval
        clearTimeout(intervalRef.current as NodeJS.Timeout);
        clearInterval(intervalRef.current as NodeJS.Timeout);
      }
    };
  }, []);

  return (
    <div
      className={cn(
        "flex cursor-pointer items-center justify-center py-1",
        "select-none transition-opacity duration-100",
        isPressed ? "opacity-70" : "opacity-100",
        "active:scale-95", // Add a subtle press effect
        className,
      )}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Stop scrolling if mouse leaves while pressed
      onMouseEnter={preventHover}
      onMouseOver={preventHover}
    >
      <ChevronUp className="h-4 w-4" />
    </div>
  );
});
SelectScrollUpButton.displayName = "CustomSelectScrollUpButton";

// Custom ScrollDownButton that only responds to clicks, not hover
const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className }) => {
  // State to track if button is being held
  const [isPressed, setIsPressed] = React.useState(false);
  // Reference to the interval
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  // Reference to track if this is a holding action
  const isHoldingRef = React.useRef(false);
  // Track whether we're in a continuous scroll
  const isContinuousScrolling = React.useRef(false);

  // Prevent any hover interactions
  const preventHover = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle single click - ensure it only fires once
  const handleClick = (e: React.MouseEvent) => {
    // Only perform click action if we're not in a "holding" state
    if (!isHoldingRef.current) {
      e.preventDefault();
      const viewport = document.querySelector(
        "[data-radix-select-viewport]",
      ) as HTMLElement;
      if (viewport) {
        smoothScroll(viewport, viewport.scrollTop + 40, 150);
      }
    }
  };

  // Smooth scroll function
  const smoothScroll = (
    element: HTMLElement,
    targetPosition: number,
    duration: number,
  ) => {
    const startPosition = element.scrollTop;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const scrollProgress = Math.min(timeElapsed / duration, 1);

      // Easing function for smoother movement
      const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

      element.scrollTop = startPosition + distance * ease(scrollProgress);

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Handle mouse down - start scrolling with delay
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPressed(true);
    isHoldingRef.current = false; // Reset holding state

    // Don't scroll immediately on mouse down - wait to see if it's a click or hold

    // Set up interval with a delay before continuous scrolling starts
    const delayMs = 300; // 300ms delay before continuous scrolling starts

    // Start continuous scrolling after delay
    const timeoutId = setTimeout(() => {
      isHoldingRef.current = true; // Mark as holding action
      isContinuousScrolling.current = true;

      // Initial scroll when holding is confirmed
      const viewport = document.querySelector(
        "[data-radix-select-viewport]",
      ) as HTMLElement;
      if (viewport) {
        smoothScroll(viewport, viewport.scrollTop + 40, 150);
      }

      intervalRef.current = setInterval(() => {
        const viewport = document.querySelector(
          "[data-radix-select-viewport]",
        ) as HTMLElement;
        if (viewport) {
          // Smoother continuous scrolling - smaller increments more frequently
          if (isContinuousScrolling.current) {
            viewport.scrollTop += 8; // Smaller increment for smoother scrolling
          }
        }
      }, 50); // More frequent updates for smoother motion
    }, delayMs);

    // Store timeout ID to clear it if needed
    intervalRef.current = timeoutId as any;
  };

  // Handle mouse up - stop scrolling
  const handleMouseUp = () => {
    setIsPressed(false);
    // Reset the holding state on mouse up
    isHoldingRef.current = false;
    isContinuousScrolling.current = false;

    if (intervalRef.current) {
      // Clear both timeout and interval
      clearTimeout(intervalRef.current as NodeJS.Timeout);
      clearInterval(intervalRef.current as NodeJS.Timeout);
      intervalRef.current = null;
    }
  };

  // Clean up interval/timeout on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        // Clear both timeout and interval
        clearTimeout(intervalRef.current as NodeJS.Timeout);
        clearInterval(intervalRef.current as NodeJS.Timeout);
      }
    };
  }, []);

  return (
    <div
      className={cn(
        "flex cursor-pointer items-center justify-center py-1",
        "select-none transition-opacity duration-100",
        isPressed ? "opacity-70" : "opacity-100",
        "active:scale-95", // Add a subtle press effect
        className,
      )}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Stop scrolling if mouse leaves while pressed
      onMouseEnter={preventHover}
      onMouseOver={preventHover}
    >
      <ChevronDown className="h-4 w-4" />
    </div>
  );
});
SelectScrollDownButton.displayName = "CustomSelectScrollDownButton";

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => {
  // Prevent any hover scrolling behavior
  const preventHoverScroll = (e: React.UIEvent) => {
    if ((e as any).type === "mouseover" || (e as any).type === "mouseenter") {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        onMouseEnter={preventHoverScroll}
        onMouseOver={preventHoverScroll}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            "overflow-y-auto",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          )}
          style={{
            scrollBehavior: "auto",
            overscrollBehavior: "contain",
          }}
          // Prevent any hover-based scrolling effects
          onMouseEnter={preventHoverScroll}
          onMouseOver={preventHoverScroll}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "transition-colors duration-150",
      "focus:bg-[#D35400] focus:text-white",
      "hover:bg-[#D35400] hover:text-white",
      "data-[state=checked]:bg-[#F5722E] data-[state=checked]:text-white data-[state=checked]:font-bold",
      "data-[state=checked]:hover:bg-[#D35400]",
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemIndicator>
      <span className="absolute left-0 top-1/2 transform -translate-y-1/2 inline-block h-full w-2 bg-[#8C4227]" />
    </SelectPrimitive.ItemIndicator>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
