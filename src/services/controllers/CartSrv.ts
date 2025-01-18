import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

import { Api, GenericResponse } from "../../classes/Api";
import { setCart } from "../redux/slices/cart";
import store from "../redux/store";
import { GenericError } from "../../classes/GenericError";
import { ProductSrv } from "./ProductSrv";
import { Cart } from "../../classes/Cart";

interface UpdateQtyParams {
  storeId: string;
  userId: string;
  productId: string;
  qty: number;
}
interface RemoveProductsParams {
  storeId: string;
  userId: string;
  productIDs: string[];
}

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
  updateQty({
    userId,
    storeId,
    qty,
    productId,
  }: UpdateQtyParams): GenericResponse<void> {
    const { error, data: cart } = this.getOne<Types.Cart>({
      userId,
      storeId,
    });
    if (error) {
      return { error };
    } else if (cart) {
      const productSrv = new ProductSrv(this.dispatch);
      const { error, data: product } =
        productSrv.getOne<Types.IProductDocument>({ productId });
      if (error) {
        return { error };
      } else if (product) {
        const { unitPrice } = product;
        const newTotalPrice = unitPrice * qty;
        const tempCart: Types.Cart = {
          ...cart,
          items: cart.items.map((item) => {
            if (item.productId === productId) {
              return {
                ...item,
                quantity: qty,
                totalPrice: newTotalPrice,
              };
            }
            return item;
          }),
        };
        const newCart = new Cart({ cart: tempCart })
          .calculateTotalPrices()
          .toObject();

        this.setCart({ userId, storeId, data: newCart });
        return { error: undefined };
      } else {
        return { error: undefined };
      }
    } else {
      return { error: undefined };
    }
  }

  removeProducts({
    storeId,
    userId,
    productIDs,
  }: RemoveProductsParams): GenericResponse<void> {
    const { error, data: cart } = this.getOne<Types.Cart>({
      userId,
      storeId,
    });
    if (error) {
      return { error };
    } else if (cart) {
      const tempCart: Types.Cart = {
        ...cart,
        items: cart.items.filter(
          (item) => !productIDs.includes(item.productId)
        ),
      };
      const newCart = new Cart({ cart: tempCart })
        .calculateTotalPrices()
        .toObject();
      this.setCart({ userId, storeId, data: newCart });
      return { error: undefined };
    } else {
      return { error: undefined };
    }
  }
}
