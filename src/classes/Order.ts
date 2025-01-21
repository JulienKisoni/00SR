import { v4 as uuidv4 } from "uuid";
import ShortUniqueId from "short-unique-id";

import store from "../services/redux/store";

interface OrderArgs {
  storeId: string;
  userId: string;
  cartItems: Types.CartItem[];
}
enum ORDER_STATUS {
  pending = "pending",
  completed = "completed",
}

export class Order implements Types.IOrderDocument {
  _id: string;
  items: Types.CartItem[];
  owner: string;
  totalPrice: number = 0;
  orderNumber: string;
  status: Types.ORDER_STATUS;
  storeId: string;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;

  constructor({ storeId, userId, cartItems }: OrderArgs) {
    this.orderNumber = this.generateOrderNumber();
    this.status = ORDER_STATUS.pending;
    this.owner = userId;
    this.storeId = storeId;
    this._id = uuidv4();
    this.items = this.refreshProductItems(cartItems);
    this.calculateTotalPrice();
    this.createdAt = new Date().toISOString();
  }

  generateOrderNumber(): string {
    //@ts-ignore
    const uid = new ShortUniqueId({ length: 6 });
    const now = new Date();
    const y = now.getFullYear();
    const m = (now.getMonth() + 1).toString().padStart(2, "0");
    const d = now.getDate().toString().padStart(2, "0");
    const fullDate = `${y}-${m}-${d}`;
    //@ts-ignore
    const orderNumber = `${fullDate}-${uid.rnd()}`;
    return orderNumber;
  }

  refreshProductItems(cartItems: Types.CartItem[]): Types.CartItem[] {
    const products = store.getState().products || [];
    const productIDs = cartItems.map((item) => item.productId);
    const refreshedProducts = products.filter((product) =>
      productIDs.includes(product._id)
    );
    const refreshedItems = cartItems.map((item) => {
      const _product = refreshedProducts.find(
        (prod) => prod._id === item.productId
      ) as Types.IProductDocument;
      const { unitPrice } = _product;
      const _cartItem: Types.CartItem = {
        productId: item.productId,
        quantity: item.quantity,
        totalPrice: item.quantity * unitPrice,
        productDetails: _product,
      };
      return _cartItem;
    });
    return refreshedItems;
  }

  calculateTotalPrice(): Types.IOrderDocument {
    this.totalPrice = this.items
      .map((elt) => elt.totalPrice || 0)
      .reduce((a: number, b: number) => {
        return a + b;
      }, 0);
    return this;
  }

  toObject(): Types.IOrderDocument {
    return {
      _id: this._id,
      items: this.items,
      totalPrice: this.totalPrice,
      orderNumber: this.orderNumber,
      owner: this.owner,
      status: this.status,
      storeId: this.storeId,
      createdAt: this.createdAt,
    };
  }
}
