import { X } from "lucide-react";
import ReactDOM from "react-dom";
import akazaLogo from "assets/akazalogo-dark.svg?url";

interface CloseConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStay: () => void;
  onLeave: () => void;
}

const CloseConfirmationModal = ({
  isOpen,
  onClose,
  onStay,
  onLeave,
}: CloseConfirmationModalProps) => {
  if (!isOpen) return null;

  // Create the modal content
  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 10000 }}
    >
      {/* Overlay - no onClick handler */}
      <div className="fixed inset-0 bg-black bg-opacity-50"></div>

      {/* Modal */}
      <div
        className="bg-white w-full max-w-[743px] relative rounded-none shadow-lg overflow-hidden"
        style={{
          height: "auto",
          minHeight: "250px",
          maxHeight: "90vh"
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-[#263238] z-10"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="p-2 sm:p-4 border-b border-gray-200">
          <img src={akazaLogo} alt="Akaza Logo" className="h-8 sm:h-10"/>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <h2 className="text-[#263238] text-[14px] sm:text-[16px] mb-2 sm:mb-4 font-bold">
            Are you sure you want to leave this sign up process?
          </h2>
          <p className="text-[#263238] text-xs sm:text-sm mb-2 sm:mb-4">
            This action cannot be undone after exiting.
          </p>
          <p className="text-xs sm:text-sm">
            <a
              href="#"
              className="text-[#F5722E] hover:underline"
              onClick={(e) => e.preventDefault()}
            >
              Contact us
            </a>{" "}
            to let us know how we can help
          </p>
        </div>

        <div className="flex-grow"></div>

        {/* Buttons */}
        <div className="flex justify-end p-3 sm:p-4 space-x-2 sm:space-x-3 mt-auto">
          <button
            onClick={onStay}
            className="bg-[#F5722E] hover:bg-[#F5722E]/90 h-8 sm:h-10 w-[90px] sm:w-[108px] text-white px-3 sm:px-6 py-0.5 md:py-1 rounded text-base sm:text-lg font-medium"
          >
            Stay
          </button>
          <button
            onClick={onLeave}
            className="border-2 border-[#F5722E] text-[#F5722E] h-8 sm:h-10 w-[90px] sm:w-[108px] hover:bg-[#F5722E] hover:text-white px-3 sm:px-6 py-0.5 md:py-1 rounded text-base sm:text-lg font-medium"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );

  // Render directly to body to avoid z-index issues
  return ReactDOM.createPortal(modalContent, document.body);
};

export { CloseConfirmationModal };