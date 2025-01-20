import { createSlice } from "@reduxjs/toolkit";
import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit";

type State = Types.IOrderDocument[];
const initialState: State = [];

const createOrderImpl: CaseReducer<
  State,
  PayloadAction<{ data: Types.IOrderDocument }>
> = (state, action) => {
  state.push(action.payload.data);
};
const deleteOrderImpl: CaseReducer<
  State,
  PayloadAction<{ orderId: string }>
> = (state, action) => {
  const index = state.findIndex(
    (product) => product._id === action.payload.orderId
  );
  if (index !== -1) {
    state.splice(index, 1);
  }
};
const deleteOrdersImpl: CaseReducer<
  State,
  PayloadAction<{ orderIDs: string[] }>
> = (state, action) => {
  const filteredOrders = state.filter(
    (order) => !action.payload.orderIDs.includes(order._id)
  );
  return filteredOrders;
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    createOrder: createOrderImpl,
    deleteOrder: deleteOrderImpl,
    deleteOrders: deleteOrdersImpl,
  },
});

export default ordersSlice;
export const { createOrder, deleteOrder, deleteOrders } = ordersSlice.actions;
