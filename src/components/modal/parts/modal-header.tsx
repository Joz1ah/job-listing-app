import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { useModal } from "../useModal";
import close_icon from "assets/close.svg?url";
import akazalogo_dark from "assets/akazalogo-dark.svg?url";
import { MODAL_HEADER_TYPE, MODAL_STATES } from "store/modal/modal.types";
import { CloseConfirmationModal } from "../close-confirmation";

const ModalHeader = () => {
  const { selectedModalHeader, toggleModal, resetModalState } = useModal();
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Get current modal state directly from Redux
  const currentModalState = useSelector((state: RootState) => state.modal.modalState);

  // List of modal states that should skip the confirmation
  const skipConfirmationModals = [
    MODAL_STATES.LOGIN,
    MODAL_STATES.SIGNUP_CONGRATULATIONS,
    MODAL_STATES.SIGNUP_SELECT_USER_TYPE,
    MODAL_STATES.SIGNUP_STEP2,
    // Add other modal states you want to skip confirmation for
  ];

  // When close icon is clicked
  const handleCloseClick = () => {
    // Check if current modal should skip confirmation
    if (currentModalState && skipConfirmationModals.includes(currentModalState)) {
      // Close directly without confirmation
      resetModalState();
      toggleModal(false);
    } else {
      // Show confirmation for other modals
      setShowConfirmation(true);
    }
  };

  // When user clicks "Stay"
  const handleStay = () => {
    setShowConfirmation(false);
  };

  // When user clicks "Leave"
  const handleLeave = () => {
    setShowConfirmation(false);
    resetModalState();
    toggleModal(false);
  };

  return (
    <>
      <div className="sticky top-0 bg-[#F5F5F7] w-full z-10">
        {selectedModalHeader === MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <img src={akazalogo_dark} alt="Akaza Logo" className="h-8" />
            <img
              className="cursor-pointer"
              src={close_icon}
              alt="Close"
              style={{ width: "24px", height: "24px" }}
              onClick={handleCloseClick}
            />
          </div>
        )}
        
        {selectedModalHeader === MODAL_HEADER_TYPE.WITH_CLOSE && (
          <div className="flex justify-end p-4">
            <img
              className="cursor-pointer"
              src={close_icon}
              alt="Close"
              style={{ width: "24px", height: "24px" }}
              onClick={handleCloseClick}
            />
          </div>
        )}
      </div>

      {/* Confirmation Modal - will be rendered directly to body */}
      <CloseConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onStay={handleStay}
        onLeave={handleLeave}
      />
    </>
  );
};

export default ModalHeader;