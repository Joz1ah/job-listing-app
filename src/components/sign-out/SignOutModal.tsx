import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import companyLogo from "images/company-logo.png";
import button_loading_spinner from "assets/loading-spinner-orange.svg?url";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { useErrorModal } from "contexts/ErrorModalContext/ErrorModalContext";
import { resetAction } from "store/store";
import { useDispatch } from "react-redux";

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignOutModal = ({ isOpen, onClose }: SignOutModalProps) => {
  const { logout } = useAuth();
  const { showError } = useErrorModal();
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Immediate state cleanup function
  const resetAppState = () => {
    // Reset Redux state first
    dispatch(resetAction());
    
    // Clear all local storage and session storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear any other client-side state or cache if needed
    // For example, if using Apollo Client:
    // client.clearStore();
  };

  const handleSignOut = () => {
    try {
      setIsLoggingOut(true);
      
      // 1. Reset app state immediately
      resetAppState();
      
      // 2. Prepare for redirect
      const redirectToHome = () => {
        window.location.href = "/";
      };
      
      // 3. Call logout function - don't wait for it to complete
      try {
        // Execute logout function
        logout();
      } catch (error) {
        console.error("Error during logout:", error);
      }
      
      // 4. Close modal immediately
      onClose();
      
      // 5. Redirect with a minimal delay to ensure UI state is updated
      // This ensures the app state reset is reflected before redirect
      setTimeout(() => {
        redirectToHome();
      }, 100); // Short delay for state updates to propagate
      
    } catch (error) {
      showError(
        "Sign Out Failed",
        "Unable to sign out properly. Please try again or contact support if the issue persists."
      );
      console.error("Sign out failed:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]"
      onClick={onClose}
    >
      <div
        className="bg-[#2D3A41] w-full max-w-[740px] h-[300px] relative"
        onClick={handleContentClick}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
          aria-label="Close modal"
          disabled={isLoggingOut}
        >
          <X size={24} />
        </button>

        <div className="flex flex-col h-full">
          {/* Logo section with bottom border */}
          <div className="p-4 border-b border-gray-600">
            <img src={companyLogo} alt="Logo" className="w-[150px] h-12" />
          </div>

          <div className="mt-4">
            <h2 className="text-white text-base font-medium px-6">
              Are you sure you want to sign out of Akaza?
            </h2>
          </div>

          <div className="flex-grow" />

          <div className="flex justify-end px-8 pb-8 space-x-2">
            <button
              onClick={onClose}
              className="bg-[#F5722E] hover:bg-[#F5722E]/90 text-white w-[100px] h-10 transition-colors duration-200 rounded"
              disabled={isLoggingOut}
            >
              Cancel
            </button>
            <button
              onClick={handleSignOut}
              className={`${
                isLoggingOut
                  ? "bg-gray-700 text-gray-300 border-gray-500 cursor-not-allowed"
                  : "bg-transparent text-[#E53835] hover:text-white hover:bg-[#E53835] border border-[#E53835]"
              } w-[100px] h-10 transition-colors duration-200 rounded flex items-center justify-center`}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <img
                    src={button_loading_spinner}
                    alt="Loading"
                    className="w-4 h-4 mr-2"
                  />
                </>
              ) : (
                "Sign out"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SignOutModal };