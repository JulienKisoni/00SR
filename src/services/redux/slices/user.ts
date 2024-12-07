import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "stores",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export default userSlice;
