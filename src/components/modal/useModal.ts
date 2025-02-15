import { useDispatch, useSelector } from "react-redux";
import { toggle, setModalHeader, resetModal } from "store/modal/modal.slice";
import { RootState } from "store/store";
import { MODAL_HEADER_TYPE } from "store/modal/modal.types";
import { useCallback } from "react";

export const useModal = () => {
  const dispatch = useDispatch();
  const { isOpen: isModalOpen, selectedModalHeader } = useSelector(
    (state: RootState) => state.modal,
  );

  const toggleModal = useCallback(
    (state?: boolean) => {
      const newModalState = state ?? !isModalOpen;
      dispatch(toggle(newModalState));
    },
    [isModalOpen],
  );

  const handleSetSelectedModalHeader = (headerType: MODAL_HEADER_TYPE) => {
    dispatch(setModalHeader(headerType));
  };

  const resetModalState = useCallback(() => {
    dispatch(resetModal());
  }, []);

  return {
    toggleModal,
    isModalOpen,
    selectedModalHeader,
    handleSetSelectedModalHeader,
    resetModalState,
  };
};
