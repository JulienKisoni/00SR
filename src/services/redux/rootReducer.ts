import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import storesSlice from "./slices/stores";
import userSlice from "./slices/user";
import usersSlice from "./slices/users";
import productsSlice from "./slices/products";
import cartSlice from "./slices/cart";
import ordersSlice from "./slices/orders";

const rootReducer = combineReducers({
  stores: storesSlice.reducer,
  user: userSlice.reducer,
  users: usersSlice.reducer,
  products: productsSlice.reducer,
  cart: cartSlice.reducer,
  orders: ordersSlice.reducer,
});

// Persist configuration
const persistConfig = {
  key: "root", // Key for the storage
  storage, // Storage engine to use (localStorage in this case)
  version: 1,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

export default persistedReducer;
