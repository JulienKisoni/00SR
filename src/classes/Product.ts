import { v4 as uuidv4 } from "uuid";
import ShortUniqueId from "short-unique-id";

interface FormValues {
  name: string;
  description: string;
  minQuantity: number;
  unitPrice: number;
  quantity: number;
}
interface Args {
  values: FormValues;
  owner: string;
  picture: string;
  id?: string;
  storeId: string;
  reviews?: [];
  key?: string;
  createdAt?: string;
}
export class Product implements Types.IProductDocument {
  _id = "";
  name = "";
  key = "";
  quantity: number = 0;
  minQuantity: number = 0;
  unitPrice: number = 0;
  storeId: string = "";
  owner = "";
  reviews = [];
  description = "";
  active = true;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
  picture: string = "";

  constructor({
    values,
    owner,
    picture,
    id,
    reviews,
    key,
    createdAt,
    storeId,
  }: Args) {
    const { name, description, quantity, minQuantity, unitPrice } = values;
    //@ts-ignore
    const uid = new ShortUniqueId({ length: 10 });
    //@ts-ignore
    this.key = key || uid.rnd();
    this._id = id || uuidv4();
    this.name = name;
    this.description = description;
    this.owner = owner;
    this.createdAt = createdAt || new Date().toISOString();
    this.picture = picture;
    this.reviews = reviews || [];
    this.minQuantity = minQuantity;
    this.unitPrice = unitPrice;
    this.quantity = quantity;
    this.storeId = storeId;
  }

  toObject(): Types.IProductDocument {
    const store: Types.IProductDocument = {
      _id: this._id,
      name: this.name,
      owner: this.owner,
      reviews: this.reviews,
      description: this.description,
      active: this.active,
      picture: this.picture,
      key: this.key,
      storeId: this.storeId,
      minQuantity: this.minQuantity,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
    };
    return store;
  }

  compareWithOld(
    oldProduct: Types.IProductDocument
  ): Partial<Types.IProductDocument> {
    const keys = Object.keys(oldProduct);
    const difference: Partial<Types.IProductDocument> = {};
    keys.forEach((key) => {
      if (key !== "reviews") {
        // @ts-ignore
        if (this[key] !== oldProduct[key]) {
          // @ts-ignore
          difference[key] = this[key];
        }
      }
    });
    return difference;
  }
}
