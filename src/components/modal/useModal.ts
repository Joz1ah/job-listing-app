import { useDispatch, useSelector } from "react-redux";
import { toggle, setModalHeader } from "store/modal/modal.slice";
import { RootState } from "store/store";
import { MODAL_HEADER_TYPE } from "store/modal/modal.types";

export const useModal = () => {
  const dispatch = useDispatch();
  const { isOpen: isModalOpen, selectedModalHeader } = useSelector(
    (state: RootState) => state.modal,
  );

  const toggleModal = () => {
    dispatch(toggle());
  };

  const handleSetSelectedModalHeader = (headerType: MODAL_HEADER_TYPE) => {
    dispatch(setModalHeader(headerType));
  };

  return {
    toggleModal,
    isModalOpen,
    selectedModalHeader,
    handleSetSelectedModalHeader,
  };
};
