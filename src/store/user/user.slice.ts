import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  PLAN_SELECTION_ITEMS,
  UserCredentials,
  UserDataState,
  UserTempCredentials,
} from "./user.types";

const initialState: UserDataState = {
  email: "",
  userId: "",
  currentSelectedPlan: PLAN_SELECTION_ITEMS.ANNUAL,
  selectedSkills: [],
  selectedSkillIds: [], // Add selectedSkillIds to store the IDs
  selectedExperience: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setTempCredentials: (state, action: PayloadAction<UserTempCredentials>) => {
      const { tempLoginEmail, tempLoginPassword } = action.payload;

      return {
        ...state,
        tempLoginEmail,
        tempLoginPassword,
      };
    },
    setSelectedPlan: (
      state,
      action: PayloadAction<Pick<UserDataState, "currentSelectedPlan">>,
    ) => {
      const { currentSelectedPlan } = action.payload;

      return {
        ...state,
        currentSelectedPlan,
      };
    },
    setCredentials: (state, action: PayloadAction<UserCredentials>) => {
      const { email, userId, selectedUserType } = action.payload;

      return {
        ...state,
        email,
        userId,
        selectedUserType,
      };
    },
    setSkills: (
      state,
      action: PayloadAction<Pick<UserDataState, "selectedSkills">>,
    ) => {
      const { selectedSkills } = action.payload;

      return {
        ...state,
        selectedSkills,
      };
    },
    // Add new reducer for skill IDs
    setSkillIds: (
      state,
      action: PayloadAction<{ skillIds: number[] }>,
    ) => {
      return {
        ...state,
        selectedSkillIds: action.payload.skillIds,
      };
    },
    // Existing reducer for experience
    setExperience: (
      state,
      action: PayloadAction<{ experience: string }>,
    ) => {
      return {
        ...state,
        selectedExperience: action.payload.experience,
      };
    },
  },
});

export const {
  setTempCredentials,
  setCredentials,
  setSelectedPlan,
  setSkills,
  setSkillIds, // Export the new action
  setExperience,
} = userSlice.actions;

export const userReducer = userSlice.reducer;