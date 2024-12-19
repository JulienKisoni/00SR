import { v4 as uuidv4 } from "uuid";

import { ProductSrv } from "../services/controllers/ProductSrv";

interface CartArgs {
  storeId?: string;
  userId?: string;
  cart?: Types.Cart;
}

export class CartItem implements Types.CartItem {
  productDetails?: Partial<Types.IProductDocument> | undefined;
  totalPrice?: number | undefined;
  productId: string;
  quantity: number;

  constructor(productId: string, quantity: number) {
    this.productId = productId;
    this.quantity = quantity;
  }

  calculateTotalPrice(productSrv: ProductSrv): CartItem {
    const { error, data } = productSrv.getOne<Types.IProductDocument>({
      productId: this.productId,
    });
    if (error) {
      this.totalPrice = 0;
    } else if (data) {
      this.productDetails = data;
      if (this.productDetails.unitPrice) {
        this.totalPrice = this.productDetails.unitPrice * this.quantity;
      } else {
        this.totalPrice = 0;
      }
    }
    return this;
  }

  toObject(): Types.CartItem {
    return {
      productId: this.productId,
      quantity: this.quantity,
      totalPrice: this.totalPrice,
      productDetails: this.productDetails,
    };
  }
}

export class Cart implements Types.Cart {
  storeId: string = "";
  totalPrices: number = 0;
  items: Types.CartItem[] = [];
  cartId: string = "";
  userId: string = "";

  constructor({ storeId, userId, cart }: CartArgs) {
    if (cart) {
      this.storeId = cart.storeId;
      this.totalPrices = cart.totalPrices;
      this.items = cart.items;
      this.cartId = cart.cartId;
      this.userId = cart.userId;
    } else if (!cart && storeId && userId) {
      this.storeId = storeId;
      this.cartId = uuidv4();
      this.userId = userId;
    } else {
      throw new Error("Could no initialize Cart");
    }
  }

  addItems(items: Types.CartItem[]): Cart {
    items.forEach((item) => {
      const index = this.items.findIndex(
        (_item) => _item.productId === item.productId
      );
      if (index !== -1) {
        const newQty = this.items[index].quantity + item.quantity;
        const newItem: Types.CartItem = {
          ...item,
          quantity: newQty,
        };
        this.items.splice(index, 1, newItem);
      } else {
        this.items.push(item);
      }
    });
    this.calculateTotalPrices();
    return this;
  }

  calculateTotalPrices(): Cart {
    this.totalPrices = this.items
      .map((elt) => elt.totalPrice || 0)
      .reduce((a: number, b: number) => {
        return a + b;
      }, 0);
    return this;
  }

  toObject(): Types.Cart {
    return {
      cartId: this.cartId,
      storeId: this.storeId,
      totalPrices: this.totalPrices,
      items: this.items,
      userId: this.userId,
    };
  }

  updateItemQty(productId: string, newQty: number): void {
    const index = this.items.findIndex((item) => item.productId === productId);
    if (index !== -1) {
      const newItem: Types.CartItem = {
        ...this.items[index],
        quantity: newQty,
      };
      this.items.splice(index, 1, newItem);
      this.calculateTotalPrices();
    }
  }
}
