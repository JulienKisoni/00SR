import { createSlice, CaseReducer, PayloadAction } from "@reduxjs/toolkit";

type State = { connectedUser: Types.IUserDocument | null };
const initialState: State = { connectedUser: null };

const setUserImpl: CaseReducer<
  State,
  PayloadAction<{ data: Types.IUserDocument | null }>
> = (state, action) => {
  state.connectedUser = action.payload.data;
};

const userSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    setUser: setUserImpl,
  },
});

export default userSlice;
export const { setUser } = userSlice.actions;
