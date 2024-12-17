import { createSlice } from "@reduxjs/toolkit";
import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit";

type State = Types.IProductDocument[];
const initialState: State = [];

const createProductImpl: CaseReducer<
  State,
  PayloadAction<{ data: Types.IProductDocument }>
> = (state, action) => {
  state.push(action.payload.data);
};
const deleteProductImpl: CaseReducer<
  State,
  PayloadAction<{ productId: string }>
> = (state, action) => {
  const index = state.findIndex(
    (product) => product._id === action.payload.productId
  );
  if (index !== -1) {
    state.splice(index, 1);
  }
};
const updateProductImpl: CaseReducer<
  State,
  PayloadAction<{ productId: string; payload: Partial<Types.IProductDocument> }>
> = (state, action) => {
  const index = state.findIndex(
    (product) => product._id === action.payload.productId
  );
  if (index !== -1) {
    const actualStore = state[index];
    const newStore: Types.IProductDocument = {
      ...actualStore,
      ...action.payload.payload,
    };
    state.splice(index, 1, newStore);
  }
};

const productsSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    createProduct: createProductImpl,
    deleteProduct: deleteProductImpl,
    updateProduct: updateProductImpl,
  },
});

export default productsSlice;
export const { createProduct, deleteProduct, updateProduct } =
  productsSlice.actions;
