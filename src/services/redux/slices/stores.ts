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
  PayloadAction<{ storeId: string; payload: Partial<Types.IStoreDocument> }>
> = (state, action) => {
  const index = state.findIndex((user) => user._id === action.payload.storeId);
  if (index !== -1) {
    const actualStore = state[index];
    const newStore: Types.IStoreDocument = {
      ...actualStore,
      ...action.payload.payload,
      address: {
        ...actualStore.address,
        ...action.payload.payload.address,
      },
    };
    state.splice(index, 1, newStore);
  }
};
const addProductImpl: CaseReducer<
  State,
  PayloadAction<{ storeId: string; payload: string }>
> = (state, action) => {
  const store = state.find((store) => store._id === action.payload.storeId);
  if (store) {
    store.products.push(action.payload.payload);
  }
};

const storesSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    createStore: createStoreImpl,
    deleteStore: deleteStoreImpl,
    updateStore: updateStoreImpl,
    addProduct: addProductImpl,
  },
});

export default storesSlice;
export const { createStore, deleteStore, updateStore, addProduct } =
  storesSlice.actions;
