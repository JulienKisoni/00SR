import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

import { Api, GenericResponse } from "../../classes/Api";
import { getStore } from "../redux/store";
import { GenericError } from "../../classes/GenericError";
import { deleteOrder, createOrder, deleteOrders } from "../redux/slices/orders";

const store = getStore();

export class OrderSrv extends Api {
  dispatch: Dispatch<UnknownAction>;
  endpoint?: string | undefined;

  constructor(dispatch: Dispatch<UnknownAction>, endpoint?: string) {
    super();
    this.dispatch = dispatch;
    this.endpoint = endpoint;
  }

  addOne<
    T extends
      | Types.IUserDocument
      | Types.IStoreDocument
      | Types.IProductDocument
      | Types.IOrderDocument,
  >(payload: T): GenericResponse<void> {
    this.dispatch(createOrder({ data: payload as Types.IOrderDocument }));
    return { data: null, error: undefined };
  }
  getOne<
    T extends
      | Types.IUserDocument
      | Types.IStoreDocument
      | Types.IProductDocument
      | Types.IOrderDocument,
  >({ orderId }: { orderId: string }): GenericResponse<T> {
    const order = store
      .getState()
      .orders.find((order) => order._id === orderId);
    if (!order) {
      const error = new GenericError("No order found");
      return { error };
    }
    return { error: undefined, data: order as T };
  }

  updateOne<T extends Types.IUserDocument | Types.IStoreDocument>(
    id: string,
    payload: Partial<T>
  ): GenericResponse<T> {
    return { error: undefined };
  }

  deleteMany(orderIDs: string[]): GenericResponse<void> {
    this.dispatch(deleteOrders({ orderIDs }));
    return { error: undefined };
  }

  deleteOne(id: string): GenericResponse<void> {
    const { error, data: order } = this.getOne<Types.IOrderDocument>({
      orderId: id,
    });
    if (error) {
      return { error };
    }
    const orderId = order?._id || "";
    this.dispatch(deleteOrder({ orderId }));
    return { error: undefined };
  }
}
