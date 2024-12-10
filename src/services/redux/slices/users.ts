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
const updateUserImpl: CaseReducer<
  State,
  PayloadAction<{ userId: string; payload: Partial<Types.IUserDocument> }>
> = (state, action) => {
  const index = state.findIndex((user) => user._id === action.payload.userId);
  if (index !== -1) {
    const actualUser = state[index];
    const newProfile = action.payload.payload.profile || {};
    const newUser = {
      ...actualUser,
      profile: {
        ...actualUser.profile,
        ...newProfile,
      },
    };
    state.splice(index, 1, newUser);
  }
};

const usersSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    createUser: createUserImpl,
    deleteUser: deleteUserImpl,
    updateUser: updateUserImpl,
  },
});

export default usersSlice;

export const { createUser, deleteUser, updateUser } = usersSlice.actions;
