import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HERO_STATES, HeroState } from "./hero.types";

const initialState: HeroState = {
  heroState: HERO_STATES.PERFECT_MATCH_ALGO,
};

export const heroSlice = createSlice({
  name: "hero",
  initialState,
  reducers: {
    setHeroState: (state, action: PayloadAction<HERO_STATES>) => {
      state.heroState = action.payload;
    },
  },
});

export const { setHeroState } = heroSlice.actions;

export const heroReducer = heroSlice.reducer;
