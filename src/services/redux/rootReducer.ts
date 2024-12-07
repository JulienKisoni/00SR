import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import storesSlice from "./slices/stores";
import userSlice from "./slices/user";

const rootReducer = combineReducers({
  stores: storesSlice.reducer,
  user: userSlice.reducer,
});

// Persist configuration
const persistConfig = {
  key: "root", // Key for the storage
  storage, // Storage engine to use (localStorage in this case)
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
