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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative bg-white shadow-lg w-[397px] h-[490px]">
          <ModalHeader />
          <div className="w-full h-[438px] overflow-x-hidden overflow-y-auto p-4">
            {children}
          </div>
        </div>
      </div>
    )
  );
};

export default Modal;
