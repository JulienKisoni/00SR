import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

import { Api, GenericResponse } from "../../classes/Api";
import { deleteStore, updateStore } from "../redux/slices/stores";
import { createProduct } from "../redux/slices/products";
import store from "../redux/store";
import { GenericError } from "../../classes/GenericError";

export class ProductSrv extends Api {
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
    const currentStore: Types.IStoreDocument | undefined = store
      .getState()
      // @ts-ignore
      .stores.find((_store) => _store._id === payload.storeId);
    if (currentStore?.products?.includes(payload._id)) {
      const error = new GenericError("Product already exist inside store");
      return { error };
    }
    this.dispatch(createProduct({ data: payload as Types.IProductDocument }));
    return { data: null, error: undefined };
  }
  getOne<T extends Types.IUserDocument | Types.IStoreDocument>(filters: {
    [key: string]: string;
  }): GenericResponse<T> {
    return { error: undefined };
  }
  updateOne<T extends Types.IUserDocument | Types.IStoreDocument>(
    id: string,
    payload: Partial<T>
  ): GenericResponse<T> {
    this.dispatch(updateStore({ storeId: id, payload }));
    return { error: undefined };
  }

  deleteOne(id: string): GenericResponse<void> {
    this.dispatch(deleteStore({ storeId: id }));
    return {};
  }
}
