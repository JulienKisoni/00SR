import { v4 as uuidv4 } from "uuid";

interface FormValues {
  name: string;
  description: string;
}
interface ReportArgs {
  storeId: string;
  userId: string;
  name: string;
  description: string;
  orders: Types.IOrderDocument[];
  reportId: string;
  createdAt?: string;
}

export class Report implements Types.IReportDocument {
  _id: string;
  owner: string;
  storeId: string;
  createdAt: string;
  updatedAt?: string | undefined;
  name: string;
  description: string;
  orders: Types.IOrderDocument[];

  constructor({
    storeId,
    userId,
    name,
    description,
    orders,
    reportId,
    createdAt,
  }: ReportArgs) {
    this.owner = userId;
    this.storeId = storeId;
    this._id = reportId || uuidv4();
    this.createdAt = createdAt || new Date().toISOString();
    this.name = name;
    this.description = description;
    this.orders = orders;
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

  toObject(): Types.IReportDocument {
    return {
      _id: this._id,
      owner: this.owner,
      storeId: this.storeId,
      createdAt: this.createdAt,
      name: this.name,
      description: this.description,
      orders: this.orders,
    };
  }
}
