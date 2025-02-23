import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

import { Api, GenericResponse } from "../../classes/Api";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "../redux/slices/products";
import { removeStoreProduct } from "../redux/slices/stores";
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
      | Types.IProductDocument,
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
  getOne<
    T extends
      | Types.IUserDocument
      | Types.IStoreDocument
      | Types.IProductDocument,
  >({ productId }: { productId: string }): GenericResponse<T> {
    const product = store
      .getState()
      .products.find((prod) => prod._id === productId);
    return { error: undefined, data: product as T };
  }
  updateOne<T extends Types.IUserDocument | Types.IStoreDocument>(
    id: string,
    payload: Partial<T>
  ): GenericResponse<T> {
    this.dispatch(updateProduct({ productId: id, payload }));
    return { error: undefined };
  }

  deleteOne(id: string): GenericResponse<void> {
    const { error, data: product } = this.getOne<Types.IProductDocument>({
      productId: id,
    });
    if (error || !product) {
      return { error: error || new GenericError("No product found") };
    }
    const storeId = product?.storeId || "";
    this.dispatch(deleteProduct({ productId: id }));
    this.dispatch(removeStoreProduct({ storeId, productId: id }));
    return { error: undefined };
  }
}
