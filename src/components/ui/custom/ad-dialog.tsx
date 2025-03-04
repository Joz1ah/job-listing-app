import { useState, useEffect, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogOverlay,
} from "components";

interface AdDialogWrapperProps {
  adImage?: string;
  popupImage?: string;
  timerDuration?: number;
}

const AdDialogWrapper = forwardRef<HTMLDivElement, AdDialogWrapperProps>(
  ({ adImage, popupImage, timerDuration = 60 }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(timerDuration);
    const navigate = useNavigate();

    // Timer logic
    useEffect(() => {
      // Add event listener to prevent ESC key from closing dialog
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen && timeLeft > 0) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      document.addEventListener("keydown", handleKeyDown, true);

      return () => {
        document.removeEventListener("keydown", handleKeyDown, true);
      };
    }, [isOpen, timeLeft]);

    useEffect(() => {
      let timerId: number | undefined;

      if (isOpen && timeLeft > 0) {
        timerId = window.setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              setIsOpen(false);
              return timerDuration;
            }
            return prevTime - 1;
          });
        }, 1000);
      }

      if (!isOpen) {
        setTimeLeft(timerDuration);
      }

      return () => {
        if (timerId) {
          clearInterval(timerId);
        }
      };
    }, [isOpen, timeLeft, timerDuration]);

    const handleImageClick = () => {
      navigate("/dashboard/account-settings/subscription");
      setIsOpen(false);
    };

    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <div
            ref={ref}
            className="bg-white border-none h-[275px] w-full max-w-[436px] rounded-lg overflow-hidden"
          >
            <img
              src={adImage}
              alt="Ad Trigger"
              className="w-full h-full object-cover cursor-pointer"
            />
          </div>
        </AlertDialogTrigger>
        <AlertDialogOverlay className="bg-black/50" />
        <AlertDialogContent
          className="p-0 border-none overflow-hidden bg-transparent w-full"
          style={{ maxWidth: "500px" }}
        >
          {/* Popup with reduced size */}
          <div className="relative cursor-pointer">
            <img
              src={popupImage}
              alt="Subscription Offer"
              className="w-full h-auto object-cover"
              onClick={handleImageClick}
              onError={(e) => {
                // Fallback to a colored background if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />

            {/* Timer */}
            <div
              className="absolute top-2 right-2 z-10 flex items-center justify-center rounded-full"
              style={{
                width: "35px",
                height: "35px",
                background: "transparent",
                border: "0.5px solid white",
              }}
            >
              <span className="text-white text-[14px]">{timeLeft}</span>
              <span className="text-white text-[12px]">s</span>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);

AdDialogWrapper.displayName = "AdDialogWrapper";

export { AdDialogWrapper };
