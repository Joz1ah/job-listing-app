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
        <div className="relative bg-white shadow-lg w-full max-w-xl h-auto sm:h-auto">
          <ModalHeader />
          <div className="p-4 sm:p-6">{children}</div>
        </div>
      </div>
    )
  );
};

export default Modal;
