import { v4 as uuidv4 } from "uuid";
import ShortUniqueId from "short-unique-id";

import { ProductSrv } from "../services/controllers/ProductSrv";
import store from "../services/redux/store";

interface OrderArgs {
  storeId: string;
  userId: string;
  cartItems: Types.CartItem[];
}

export class Order implements Types.IOrderDocument {
  _id: string;
  items: Types.CartItem[];
  owner: string;
  totalPrice: number = 0;
  orderNumber: string;
  status: Types.ORDER_STATUS;
  storeId: string;

  constructor({ storeId, userId, cartItems }: OrderArgs) {
    this.orderNumber = this.generateOrderNumber();
    this.status = Types.ORDER_STATUS.pending;
    this.owner = userId;
    this.storeId = storeId;
    this._id = uuidv4();
    this.items = this.refreshProductItems(cartItems);
    this.calculateTotalPrice();
  }

  generateOrderNumber(): string {
    const uid = new ShortUniqueId({ length: 6 });
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDay() + 1;
    const fullDate = `${y}-${m}-${d}`;
    console.log({ fullDate });
    return `${fullDate}-${uid.rnd()}`;
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
      return {
        productId: item.productId,
        quantity: item.quantity,
        totalPrice: item.quantity * unitPrice,
      };
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
    };
  }
}
