// import { ORDER_STATUS } from './enums';

declare namespace Types {
  enum USER_ROLES {
    user = "user",
    admin = "admin",
  }

  interface Timestamps {
    createdAt?: Date;
    updatedAt?: Date;
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
    products: string[];
    description: string;
    address: Address;
    active: boolean;
    __v?: number;
  }

  // export interface IProductDocument extends Timestamps {
  //   _id: string | Schema.Types.ObjectId;
  //   name: string;
  //   quantity: number;
  //   storeId: string | Schema.Types.ObjectId;
  //   description: string;
  //   minQuantity: number;
  //   owner: string | Schema.Types.ObjectId;
  //   active: boolean;
  //   unitPrice: number;
  //   reviews: (string | Schema.Types.ObjectId)[];
  //   reviewDetails?: Partial<IReviewDocument>[];
  //   __v?: number;
  // }

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
