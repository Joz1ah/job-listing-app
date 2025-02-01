import React, { useEffect } from "react";
import { X } from "lucide-react";
import companyLogo from "assets/images/company-logo.png";

interface FreeTrialConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const FreeTrialConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: FreeTrialConfirmationModalProps) => {
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

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#2D3A41] w-full max-w-[740px] h-[300px] relative"
        onClick={handleContentClick}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-600">
            <img src={companyLogo} alt="Logo" className="w-[150px] h-12" />
          </div>

          <div className="mt-4">
            <h2 className="text-[#F5722E] text-xl font-medium px-6">
              You're about to proceed with the next step.
            </h2>
            <p className="text-white text-base px-6 mt-2">
              This is to confirm that you would like to continue to a free trial
            </p>
          </div>

          <div className="flex-grow" />

          <div className="flex justify-end px-8 pb-8 space-x-2">
            <button
              onClick={onClose}
              className="bg-transparent text-[#F5722E] hover:text-white hover:bg-[#F5722E]/90 border border-[#F5722E] w-[100px] h-10 transition-colors duration-200 rounded"
            >
              Back
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="bg-[#F5722E] hover:bg-[#F5722E]/90 text-white w-[100px] h-10 transition-colors duration-200 rounded"
            >
              {isLoading ? "Processing..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { FreeTrialConfirmationModal };