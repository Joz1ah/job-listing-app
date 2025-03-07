import { useState, forwardRef, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface AdDialogWrapperProps {
  adImage?: string;
  popupImage?: string;
}

const AdDialogWrapper = forwardRef<HTMLDivElement, AdDialogWrapperProps>(
  ({ adImage, popupImage }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const portalRef = useRef<HTMLDivElement | null>(null);

    // Manage scroll locking
    useEffect(() => {
      // Save original body styles
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalPaddingRight = document.body.style.paddingRight;

      if (isOpen) {
        // Lock scrolling when dialog opens
        document.body.style.overflow = "hidden";

        // Prevent content shift by adding padding equal to scrollbar width
        const scrollbarWidth =
          window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) {
          document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
      } else {
        // Restore original body styles
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.paddingRight = originalPaddingRight;

        // Force layout recalculation
        window.scrollTo(window.scrollX, window.scrollY);
      }

      // Cleanup when component unmounts
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }, [isOpen]);

    // Setup portal container
    useEffect(() => {
      // Create portal container if it doesn't exist
      if (!portalRef.current) {
        const div = document.createElement("div");
        div.id = "ad-dialog-portal";
        document.body.appendChild(div);
        portalRef.current = div;
      }

      // Cleanup portal on unmount
      return () => {
        if (portalRef.current && document.body.contains(portalRef.current)) {
          document.body.removeChild(portalRef.current);
        }
      };
    }, []);

    const openDialog = () => {
      setIsOpen(true);
    };

    const closeDialog = () => {
      setIsOpen(false);
      // Double-check scroll is restored
      setTimeout(() => {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.paddingRight = "";
      }, 0);
    };

    const handleSubscribeClick = () => {
      closeDialog();
      // Delay navigation slightly to ensure dialog close effects run first
      setTimeout(() => {
        navigate("/dashboard/account-settings/subscription");
      }, 100);
    };

    return (
      <>
        {/* Trigger element */}
        <div
          ref={ref}
          onClick={openDialog}
          className="bg-white border-none h-auto w-full max-w-[436px] rounded-lg overflow-hidden cursor-pointer"
        >
          {adImage && (
            <img
              src={adImage}
              alt="Ad Trigger"
              className="w-full h-auto object-contain"
            />
          )}
        </div>

        {/* Portal for dialog */}
        {isOpen &&
          portalRef.current &&
          createPortal(
            <div
              className="fixed inset-0 z-50 flex items-center justify-center"
              role="dialog"
              aria-modal="true"
              aria-labelledby="dialog-title"
              aria-describedby="dialog-description"
            >
              {/* Backdrop/overlay */}
              <div
                className="fixed inset-0 bg-black/80 transition-opacity"
                onClick={closeDialog}
                aria-hidden="true"
              />

              {/* Dialog content */}
              <div className="relative z-10 p-0 border-none overflow-hidden bg-transparent w-full max-w-[500px]">
                {/* Screen reader content */}
                <div className="sr-only" id="dialog-title">
                  Subscription Offer
                </div>
                <div className="sr-only" id="dialog-description">
                  Subscription offer popup with upgrade options for premium
                  features
                </div>

                <div className="relative">
                  {/* Popup image */}
                  {popupImage && (
                    <img
                      src={popupImage}
                      alt="Subscription Offer"
                      className="w-full h-auto object-contain cursor-default"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  )}

                  {/* Close button */}
                  <button
                    onClick={closeDialog}
                    className="absolute top-2 right-2 z-10 bg-transparent rounded-full p-1 transition-colors"
                    aria-label="Close dialog"
                  >
                    <X size={16} color="white" />
                  </button>

                  {/* Subscribe button */}
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
              </div>
            </div>,
            portalRef.current,
          )}
      </>
    );
  },
);

AdDialogWrapper.displayName = "AdDialogWrapper";

export { AdDialogWrapper };
