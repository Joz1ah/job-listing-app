import {
  configureStore,
  Action,
  StateFromReducersMapObject,
  Dispatch,
  UnknownAction,
  EnhancedStore,
  ThunkDispatch,
  createAction,
} from "@reduxjs/toolkit";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { ThunkAction } from "redux-thunk";

import { rootReducer, mainReducer } from "./rootReducer";
import {
  pokemonApi,
  akazaApiSignUp,
  akazaApiAuth,
  akazaApiJobFeed,
  akazaApiPayment,
  akazaApiPerfectMatch,
  akazaApiInterviewRequest,
  akazaApiSearch,
  akazaApiAccount,
  akazaApiPerfectMatchHero,
  localApi,
} from "api";
import { persistStateToLocalStorage } from "./middlewares";
import { isServer } from "utils";

const resetAction = createAction("RESET_STATE");

const middlewares = [
  ...(!isServer ? [persistStateToLocalStorage(["counter", "pokemonApi"])] : []),
  pokemonApi.middleware,
  akazaApiSignUp.middleware,
  akazaApiAuth.middleware,
  akazaApiJobFeed.middleware,
  akazaApiPayment.middleware,
  akazaApiPerfectMatch.middleware,
  akazaApiInterviewRequest.middleware,
  akazaApiSearch.middleware,
  akazaApiAccount.middleware,
  akazaApiPerfectMatchHero.middleware,
  localApi.middleware,
];

const initStore = (preloadedState?: Partial<RootState>): EnhancedStore =>
  configureStore({
    reducer: (state, action) => {
      if (action.type === resetAction.type) {
        state = undefined;
      }
      return mainReducer(state, action);
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST'], // Ignore serializability check for 'persist/PERSIST'
          //ignoredPaths: ['register', 'rehydrate'], // Optionally ignore certain paths
        },
      }).concat(middlewares),
    preloadedState,
    devTools: String(process.env.NODE_ENV).trim() !== "production",
  });

export type Store = ReturnType<typeof initStore>;
export type RootState = StateFromReducersMapObject<typeof rootReducer>;
export type AppDispatch = Store["dispatch"];
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;

export const useAppDispatch = (): Dispatch<UnknownAction> &
  ThunkDispatch<RootState, undefined, UnknownAction> =>
  useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { initStore, resetAction };
