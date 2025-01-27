import { combineReducers, UnknownAction } from "@reduxjs/toolkit";

import { counterReducer } from "./counter/counterSlice";
import { themeReducer } from "./theme/themeSlice";
import { i18nReducer } from "i18n/i18nSlice";
import {
  pokemonApi,
  akazaApiSignUp,
  akazaApiAuth,
  akazaApiJobFeed,
  akazaApiPayment,
  akazaApiPerfectMatch,
  akazaApiSearch,
  akazaApiAccount,
  localApi,
} from "api";

import { reduxHydrationAction } from "constants/commonConstants";
import { modalReducer } from "./slices/modalSlice";

export const rootReducer = {
  theme: themeReducer,
  counter: counterReducer,
  modal: modalReducer,
  i18n: i18nReducer,
  [pokemonApi.reducerPath]: pokemonApi.reducer,
  [akazaApiSignUp.reducerPath]: akazaApiSignUp.reducer,
  [akazaApiAuth.reducerPath]: akazaApiAuth.reducer,
  [akazaApiJobFeed.reducerPath]: akazaApiJobFeed.reducer,
  [akazaApiPayment.reducerPath]: akazaApiPayment.reducer,
  [akazaApiPerfectMatch.reducerPath]: akazaApiPerfectMatch.reducer,
  [akazaApiSearch.reducerPath]: akazaApiSearch.reducer,
  [akazaApiAccount.reducerPath]: akazaApiAccount.reducer,
  [localApi.reducerPath]: akazaApiAccount.reducer,
};

export const appReducer = combineReducers(rootReducer);

export const mainReducer: any = (
  state: ReturnType<typeof appReducer>,
  action: UnknownAction,
) => {
  /*
    Global action for whole state hydration.
  */
  if (action?.type === reduxHydrationAction) {
    const nextState = {
      ...state,
      ...(action.payload as object),
    };
    return nextState;
  }

  return appReducer(state, action);
};
