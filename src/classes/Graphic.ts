import { v4 as uuidv4 } from "uuid";

interface FormValues {
  name: string;
  description: string;
}
interface GraphicArgs {
  storeId: string;
  userId: string;
  name: string;
  description: string;
  products: Types.IHistoryDocument[];
  graphicId: string;
  createdAt?: string;
}

export class Graphic implements Types.IGraphicDocument {
  _id: string;
  owner: string;
  storeId: string;
  createdAt: string;
  updatedAt?: string | undefined;
  name: string;
  description: string;
  products: Types.IHistoryDocument[];

  constructor({
    storeId,
    userId,
    name,
    description,
    products,
    graphicId,
    createdAt,
  }: GraphicArgs) {
    this.owner = userId;
    this.storeId = storeId;
    this._id = graphicId || uuidv4();
    this.createdAt = createdAt || new Date().toISOString();
    this.name = name;
    this.description = description;
    this.products = products;
  }

  compareWithOld(oldReport: FormValues): Partial<FormValues> {
    const keys = Object.keys(oldReport);
    const difference: Partial<FormValues> = {};
    keys.forEach((key) => {
      // @ts-ignore
      if (this[key] !== oldReport[key]) {
        // @ts-ignore
        difference[key] = this[key];
      }
    });
    return difference;
  }

  toObject(): Types.IGraphicDocument {
    return {
      _id: this._id,
      owner: this.owner,
      storeId: this.storeId,
      createdAt: this.createdAt,
      name: this.name,
      description: this.description,
      products: this.products,
    };
  }
}
