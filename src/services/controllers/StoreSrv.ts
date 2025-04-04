import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

import { Api, GenericResponse } from "../../classes/Api";
import {
  addProduct,
  createStore,
  deleteStore,
  updateStore,
} from "../redux/slices/stores";
import { getStore } from "../redux/store";
import { GenericError } from "../../classes/GenericError";

export class StoreSrv extends Api {
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
      | Types.IProductDocument,
  >(payload: T): GenericResponse<void> {
    const _id = uuidv4();
    const body = {
      ...payload,
      _id,
      createdAt: new Date().toISOString(),
    } as Types.IStoreDocument;
    this.dispatch(createStore({ data: body }));
    return { data: null, error: undefined };
  }
  getOne<
    T extends
      | Types.IUserDocument
      | Types.IStoreDocument
      | Types.IProductDocument,
  >(filters: { [key: string]: string }): GenericResponse<T> {
    const { _id } = filters;
    if (_id) {
      const store = getStore();
      const _store = store.getState().stores.find((elt) => elt._id === _id);
      if (_store) {
        return { data: _store as T };
      }
      const error = new GenericError("No store found");
      return { error };
    }
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

  addProductToStore(storeId: string, productId: string): void {
    this.dispatch(addProduct({ storeId, payload: productId }));
  }
}
