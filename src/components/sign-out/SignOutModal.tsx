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

  // Function to make a full page request to ensure all data is synced
  const performFullPageRequest = async () => {
    try {
      // Create a full page request to the current URL to sync all data
      const currentUrl = window.location.href;
      const response = await fetch(currentUrl, {
        method: "GET",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new Error(`Page sync failed with status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.warn("Full page request before logout failed:", error);
      // Continue with logout even if sync fails
      return true;
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);

      // Perform full page request to sync data before logging out
      await performFullPageRequest();

      // Proceed with logout
      await logout();
      localStorage.clear();
      sessionStorage.clear();
      dispatch(resetAction());
      onClose();
      // Perform a full page refresh by setting window.location instead of using router navigation
      window.location.href = "/";
    } catch (error) {
      showError(
        "Sign Out Failed",
        "Unable to sign out properly. Please try again or contact support if the issue persists.",
      );
      console.error("Sign out failed:", error);
    } finally {
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
