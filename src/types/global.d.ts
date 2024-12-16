// import { ORDER_STATUS } from './enums';

declare namespace Types {
  enum USER_ROLES {
    user = "user",
    admin = "admin",
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
    //   storesDetails?: Partial<IStoreDocument>[];
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

  // export interface CartItem {
  //   productId: string | Schema.Types.ObjectId;
  //   quantity: number;
  //   productDetails?: Partial<IProductDocument>;
  // }

  // export interface IOrderDocument extends Timestamps {
  //   __v?: number;
  //   _id: string | Schema.Types.ObjectId;
  //   items: CartItem[];
  //   owner: string | Schema.Types.ObjectId;
  //   totalPrice: number;
  //   orderNumber: string;
  //   status: ORDER_STATUS;
  // }
}
