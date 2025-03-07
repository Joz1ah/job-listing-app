import { useState, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogOverlay,
} from "components";
import { X } from "lucide-react";

interface AdDialogWrapperProps {
  adImage?: string;
  popupImage?: string;
}

const AdDialogWrapper = forwardRef<HTMLDivElement, AdDialogWrapperProps>(
  ({ adImage, popupImage }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubscribeClick = () => {
      navigate("/dashboard/account-settings/subscription");
      setIsOpen(false);
    };

    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <div
            ref={ref}
            className="bg-white border-none h-auto w-full max-w-[436px] rounded-lg overflow-hidden"
          >
            <img
              src={adImage}
              alt="Ad Trigger"
              className="w-full h-auto object-contain cursor-pointer"
            />
          </div>
        </AlertDialogTrigger>
        <AlertDialogOverlay className="bg-black/50" />
        <AlertDialogContent
          className="p-0 border-none overflow-hidden bg-transparent w-full"
          style={{ maxWidth: "500px" }}
        >
          {/* Popup with only the Subscribe button being clickable */}
          <div className="relative">
            <img
              src={popupImage}
              alt="Subscription Offer"
              className="w-full h-auto object-contain cursor-default"
              onError={(e) => {
                // Fallback to a colored background if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />

            {/* X Button - Positioned at the top right */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 z-10 bg-transparent rounded-full p-1 transition-colors"
              aria-label="Close"
            >
              <X size={16} color="white" />
            </button>

            {/* Subscribe Today Button - Positioned at the bottom left as shown in image */}
            <div className="absolute bottom-2 left-[10%]">
              <button
                onClick={handleSubscribeClick}
                className="bg-[#4BAF66] text-white font-medium rounded-md cursor-pointer hover:bg-green-500 transition-colors w-[120px] sm:w-[173px] h-[24px] sm:h-[32px] text-xs sm:text-sm flex items-center justify-center"
                style={{
                  fontWeight: 500,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                }}
              >
                Subscribe Today
              </button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);

AdDialogWrapper.displayName = "AdDialogWrapper";

export { AdDialogWrapper };
