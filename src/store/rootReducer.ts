import { combineReducers, UnknownAction } from "@reduxjs/toolkit";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 

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
  akazaApiInterviewRequest,
  akazaApiPerfectMatchHero,
  localApi,
} from "api";

import { reduxHydrationAction } from "constants/commonConstants";
import { modalReducer } from "./modal/modal.slice";
import { heroReducer } from "./hero/hero.slice";
import { userReducer } from "./user/user.slice";
import { userResetPasswordReducer } from "./user/userResetPassword.slice";

const userResetPasswordPersistConfig = {
  key: 'userResetPassword', // Unique key for the user slice in localStorage
  storage, // We use localStorage as the storage mechanism
  //whitelist: ['user', 'isAuthenticated'], // Persist specific keys (optional)
};

const persistedUserResetPasswordReducer = persistReducer(userResetPasswordPersistConfig, userResetPasswordReducer);

export const rootReducer = {
  theme: themeReducer,
  counter: counterReducer,
  modal: modalReducer,
  hero: heroReducer,
  i18n: i18nReducer,
  user: userReducer,
  userResetPassword: persistedUserResetPasswordReducer, //userResetPasswordReducer,
  [pokemonApi.reducerPath]: pokemonApi.reducer,
  [akazaApiSignUp.reducerPath]: akazaApiSignUp.reducer,
  [akazaApiAuth.reducerPath]: akazaApiAuth.reducer,
  [akazaApiJobFeed.reducerPath]: akazaApiJobFeed.reducer,
  [akazaApiPayment.reducerPath]: akazaApiPayment.reducer,
  [akazaApiPerfectMatch.reducerPath]: akazaApiPerfectMatch.reducer,
  [akazaApiSearch.reducerPath]: akazaApiSearch.reducer,
  [akazaApiAccount.reducerPath]: akazaApiAccount.reducer,
  [akazaApiInterviewRequest.reducerPath]: akazaApiInterviewRequest.reducer,
  [akazaApiPerfectMatchHero.reducerPath]: akazaApiPerfectMatchHero.reducer,
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
