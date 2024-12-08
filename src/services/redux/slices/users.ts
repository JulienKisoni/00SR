import { createSlice, CaseReducer, PayloadAction } from "@reduxjs/toolkit";

type State = Types.IUserDocument[];
const initialState: State = [];

const createUserImpl: CaseReducer<
  State,
  PayloadAction<{ data: Types.IUserDocument }>
> = (state, action) => {
  state.push(action.payload.data);
};
const deleteUserImpl: CaseReducer<State, PayloadAction<{ userId: string }>> = (
  state,
  action
) => {
  const index = state.findIndex((user) => user._id === action.payload.userId);
  if (index !== -1) {
    state.splice(index, 1);
  }
};

const usersSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    createUser: createUserImpl,
    deleteUser: deleteUserImpl,
  },
});

export default usersSlice;

export const { createUser, deleteUser } = usersSlice.actions;
