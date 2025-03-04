import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    UserResetDataState
} from "./user.types";

const initialState: UserResetDataState = {
    currentResetPasswordEmail: "",
    isResetPasswordSuccesful: false
};

export const userResetPasswordSlice = createSlice({
  name: "userResetPassword",
  initialState,
  reducers: {
    setCurrentResetPasswordEmail: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        currentResetPasswordEmail: action.payload,
      };
    },
  },
});

export const {
    setCurrentResetPasswordEmail
} = userResetPasswordSlice.actions;

export const userResetPasswordReducer = userResetPasswordSlice.reducer;
