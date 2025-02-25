import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import rootReducer, { RootState } from "./rootReducer";

let store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: true,
});

export const setupStore = (preloadedState?: RootState) => {
  store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });
  return store;
};

export type AppStore = ReturnType<typeof setupStore>;

export const getStore = () => store;
