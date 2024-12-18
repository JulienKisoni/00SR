import { createSlice } from "@reduxjs/toolkit";
import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit";

type State = Record<string, Types.Cart | undefined>;
const initialState: State = {};

const setCartImpl: CaseReducer<
  State,
  PayloadAction<{ data: Types.Cart | undefined; userId: string }>
> = (state, action) => {
  state[action.payload.userId] = action.payload.data;
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
