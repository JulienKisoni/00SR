import { createSlice } from "@reduxjs/toolkit";
import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit";

type State = Types.IStoreDocument[];
const initialState: State = [];

const createStoreImpl: CaseReducer<
  State,
  PayloadAction<{ data: Types.IStoreDocument }>
> = (state, action) => {
  state.push(action.payload.data);
};
const deleteStoreImpl: CaseReducer<
  State,
  PayloadAction<{ storeId: string }>
> = (state, action) => {
  const index = state.findIndex((user) => user._id === action.payload.storeId);
  if (index !== -1) {
    state.splice(index, 1);
  }
};
const updateStoreImpl: CaseReducer<
  State,
  PayloadAction<{ storeId: string; payload: Partial<Types.IUserDocument> }>
> = (state, action) => {
  const index = state.findIndex((user) => user._id === action.payload.storeId);
  if (index !== -1) {
    const actualStore = state[index];
    const newStore = {
      ...actualStore,
      ...action.payload.payload,
    };
    state.splice(index, 1, newStore);
  }
};

const storesSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    createStore: createStoreImpl,
    deleteStore: deleteStoreImpl,
    updateStore: updateStoreImpl,
  },
});

export default storesSlice;
export const { createStore, deleteStore, updateStore } = storesSlice.actions;
