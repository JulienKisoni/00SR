import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

import { Api, GenericResponse } from "../../classes/Api";
import { setCart } from "../redux/slices/cart";
import store from "../redux/store";
import { GenericError } from "../../classes/GenericError";

export class CartSrv extends Api {
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
  >(payload: T): GenericResponse<void> {
    return { error: undefined };
  }
  getOne<
    T extends
      | Types.IUserDocument
      | Types.IStoreDocument
      | Types.IProductDocument
      | Types.Cart
  >({
    userId,
    storeId,
  }: {
    userId: string;
    storeId: string;
  }): GenericResponse<T> {
    const cart = store.getState().cart[userId][storeId];
    const error = new GenericError("No existing cart for this user");
    if (!cart) {
      return { error };
    }
    return { data: cart as T };
  }
  updateOne<T extends Types.IUserDocument | Types.IStoreDocument>(
    id: string,
    payload: Partial<T>
  ): GenericResponse<T> {
    return { error: undefined };
  }

  setCart({
    userId,
    data,
    storeId,
  }: {
    userId: string;
    storeId: string;
    data: Types.Cart;
  }) {
    this.dispatch(setCart({ data, userId, storeId }));
  }

  deleteOne(userId: string, storeId: string): GenericResponse<void> {
    const { error } = this.getOne<Types.Cart>({
      userId,
      storeId,
    });
    if (error) {
      return { error };
    }
    this.dispatch(setCart({ userId, storeId, data: undefined }));
    return { error: undefined };
  }
}
