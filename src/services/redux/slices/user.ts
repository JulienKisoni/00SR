import { createSlice, CaseReducer, PayloadAction } from "@reduxjs/toolkit";

type State = {
  connectedUser: Types.IUserDocument | null;
  selectedStore: Types.IStoreDocument | null;
};
const initialState: State = { connectedUser: null, selectedStore: null };

const setUserImpl: CaseReducer<
  State,
  PayloadAction<{ data: Types.IUserDocument | null }>
> = (state, action) => {
  state.connectedUser = action.payload.data;
};
const selectStoreImpl: CaseReducer<
  State,
  PayloadAction<{ data: Types.IStoreDocument | null }>
> = (state, action) => {
  state.selectedStore = action.payload.data;
};

const userSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    setUser: setUserImpl,
    selectStore: selectStoreImpl,
  },
});

export default userSlice;
export const { setUser, selectStore } = userSlice.actions;
