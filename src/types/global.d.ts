declare namespace Types {
  enum USER_ROLES {
    user = "user",
    admin = "admin",
  }

  enum ORDER_STATUS {
    pending = "pending",
    completed = "completed",
  }

  type FormMode = "readonly" | "edit" | "add";

  interface Timestamps {
    createdAt?: string;
    updatedAt?: string;
  }

  export interface IUserDocument extends Timestamps {
    _id: string;
    email: string;
    password: string;
    storeIds?: string[];
    profile: {
      username: string;
      picture: any;
      role: USER_ROLES | string;
    };
    __v?: number;
  }

  interface Address {
    line1: string;
    line2?: string;
    country: string;
    state: string;
    city: string;
  }

  export interface IStoreDocument extends Timestamps {
    _id: string;
    name: string;
    owner: string;
    picture: string;
    products: string[];
    description: string;
    address: Address;
    active: boolean;
    __v?: number;
  }

  export interface IProductDocument extends Timestamps {
    _id: string;
    name: string;
    key: string;
    quantity: number;
    storeId: string;
    description: string;
    minQuantity: number;
    owner: string;
    active: boolean;
    unitPrice: number;
    reviews: string[];
    picture: string;
    __v?: number;
  }

  export interface CartItem {
    productId: string;
    quantity: number;
    totalPrice?: number;
    productDetails?: Partial<IProductDocument>;
  }

  export interface Cart {
    storeId: string;
    userId: string;
    totalPrices: number;
    items: Types.CartItem[];
    cartId: string;
  }

  export interface IOrderDocument extends Timestamps {
    __v?: number;
    _id: string;
    items: Types.CartItem[];
    owner: string;
    ownerDetails?: Partial<Types.IUserDocument>;
    storeId: string;
    totalPrice: number;
    orderNumber: string;
    status: ORDER_STATUS;
  }
  export interface IReportDocument extends Timestamps {
    __v?: number;
    _id: string;
    name: string;
    description: string;
    owner: string;
    storeId: string;
    ownerDetails?: Partial<Types.IUserDocument>;
    orders: Types.IOrderDocument[];
  }
}
