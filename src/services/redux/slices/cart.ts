import { createSlice } from "@reduxjs/toolkit";
import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit";

type State = Record<string, Record<string, Types.Cart | undefined>>;
const initialState: State = {};

const setCartImpl: CaseReducer<
  State,
  PayloadAction<{
    data: Types.Cart | undefined;
    userId: string;
    storeId: string;
  }>
> = (state, action) => {
  if (!state[action.payload.userId]) {
    state[action.payload.userId] = {};
  }
  if (!state[action.payload.userId][action.payload.storeId]) {
    state[action.payload.userId][action.payload.storeId] = {} as Types.Cart;
  }
  state[action.payload.userId][action.payload.storeId] = action.payload.data;
};

const cartSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    setCart: setCartImpl,
  },
});

export default cartSlice;
export const { setCart } = cartSlice.actions;
