import { createSlice, CaseReducer, PayloadAction } from "@reduxjs/toolkit";

const initialState: Types.IUserDocument[] = [];

const createUserImpl: CaseReducer<
  Types.IUserDocument[],
  PayloadAction<{ data: Types.IUserDocument }>
> = (state, action) => {
  state.push(action.payload.data);
};

const usersSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    createUser: createUserImpl,
  },
});

export default usersSlice;

export const { createUser } = usersSlice.actions;
