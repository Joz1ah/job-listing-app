import { ReactNode } from "react";
import ModalHeader from "./parts/modal-header";
import { useModal } from "./useModal";

type ModalProps = {
  children: ReactNode;
};

const Modal = ({ children }: ModalProps) => {
  const { isModalOpen } = useModal();

  return (
    isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-maskTransitionOpen">
        <div className="relative bg-[#F5F5F7] shadow-lg mx-4 w-[397px] md:w-[642px] h-[490px] md:h-[554px] overflow-x-hidden overflow-y-auto custom-scrollbar">
          <ModalHeader />
          <div className="w-full">{children}</div>
        </div>
      </div>
    )
  );
};

export default Modal;
