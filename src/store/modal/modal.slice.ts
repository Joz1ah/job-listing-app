import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ModalState,
  MODAL_HEADER_TYPE,
  MODAL_STATES,
} from "store/modal/modal.types";

const initialState: ModalState = {
  isOpen: false,
  selectedModalHeader: MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE,
  modalState: MODAL_STATES.AUTHNET_PAYMENT_FULL,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggle: (state) => {
      return {
        ...state,
        selectedModalHeader: !state.isOpen
          ? MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE
          : state.selectedModalHeader,
        isOpen: !state.isOpen,
      };
    },
    setModalHeader: (state, action: PayloadAction<MODAL_HEADER_TYPE>) => {
      return {
        ...state,
        selectedModalHeader: action.payload,
      };
    },
    setModalState: (state, action: PayloadAction<MODAL_STATES>) => {
      return {
        ...state,
        modalState: action.payload,
      };
    },
  },
});

export const { toggle, setModalHeader, setModalState } = modalSlice.actions;

export const modalReducer = modalSlice.reducer;
