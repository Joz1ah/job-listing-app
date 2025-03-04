import { useRef } from "react";
import { useModal } from "../useModal";
import close_icon from "assets/close.svg?url";
import akazalogo_dark from "assets/akazalogo-dark.svg?url";
import { MODAL_HEADER_TYPE } from "store/modal/modal.types";

const ModalHeader = () => {
  const { selectedModalHeader, toggleModal, resetModalState } = useModal();
  const closeModalRef = useRef<HTMLImageElement>(null);

  return (
    <div className="sticky top-0 bg-[#F5F5F7] w-full z-10">
      {selectedModalHeader === MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE && (
        <>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <img src={akazalogo_dark} alt="Akaza Logo" className="h-8" />
            <img
              ref={closeModalRef}
              className="cursor-pointer"
              src={close_icon}
              alt="Close"
              style={{ width: "24px", height: "24px" }}
              onClick={() => {
                resetModalState();
                toggleModal();
              }}
            />
          </div>
        </>
      )}
      {selectedModalHeader === MODAL_HEADER_TYPE.WITH_CLOSE && (
        <div className="flex justify-end p-4">
          <img
            ref={closeModalRef}
            className="cursor-pointer"
            src={close_icon}
            alt="Close"
            style={{ width: "24px", height: "24px" }}
            onClick={() => {
              resetModalState();
              toggleModal();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ModalHeader;
