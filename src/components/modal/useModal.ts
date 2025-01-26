import { useCallback, useState } from "react";

export enum MODAL_HEADER_TYPE {
  WITH_LOGO_AND_CLOSE = 1,
  WITH_CLOSE = 2,
}

export const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModalHeader, setSelectedModalHeader] =
    useState<MODAL_HEADER_TYPE>(MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE);

  const toggleModal = useCallback(() => {
    setIsModalOpen((state) => {
      if (!state) {
        setSelectedModalHeader(MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE);
      }

      return !state;
    });
  }, [isModalOpen]);

  const handleSetSelectedModalHeader = (headerType: MODAL_HEADER_TYPE) => {
    setSelectedModalHeader(headerType);
  };

  return {
    toggleModal,
    isModalOpen,
    selectedModalHeader,
    handleSetSelectedModalHeader,
  };
};
