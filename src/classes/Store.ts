import { v4 as uuidv4 } from "uuid";

interface FormValues {
  line1: string;
  line2?: string;
  country: string;
  state: string;
  city: string;
  name: string;
  description: string;
}
interface Args {
  values: FormValues;
  owner: string;
  picture: string;
  id?: string;
  products?: [];
}
export class Store implements Types.IStoreDocument {
  _id = "";
  name = "";
  owner = "";
  products = [];
  description = "";
  address: Types.Address = {} as Types.Address;
  active = true;
  createdAt: string;
  updatedAt?: string | undefined;
  picture: string = "";

  constructor({ values, owner, picture, id, products }: Args) {
    const { name, description, line1, line2, country, state, city } = values;
    this._id = id || uuidv4();
    this.name = name;
    this.description = description;
    this.owner = owner;
    this.address = {
      line1,
      line2,
      country,
      state,
      city,
    };
    this.createdAt = new Date().toISOString();
    this.picture = picture;
    this.products = products || [];
  }

  toObject(): Types.IStoreDocument {
    const store: Types.IStoreDocument = {
      _id: this._id,
      name: this.name,
      owner: this.owner,
      products: this.products,
      description: this.description,
      active: this.active,
      picture: this.picture,
      address: this.address,
      createdAt: this.createdAt,
    };
    return store;
  }

  compareWithOld(
    oldStore: Types.IStoreDocument
  ): Partial<Types.IStoreDocument> {
    const keys = Object.keys(oldStore);
    const difference: Partial<Types.IStoreDocument> = {
      address: {} as Types.Address,
    };
    keys.forEach((key) => {
      if (key !== "address" && key !== "products") {
        // @ts-ignore
        if (this[key] !== oldStore[key]) {
          // @ts-ignore
          difference[key] = this[key];
        }
      } else if (key === "address") {
        const addressKeys = Object.keys(oldStore.address);
        addressKeys.forEach((addressKey) => {
          // @ts-ignore
          if (this.address[addressKey] !== oldStore.address[addressKey]) {
            // @ts-ignore
            difference.address[addressKey] = this.address[addressKey];
          }
        });
      }
    });
    return difference;
  }
}
