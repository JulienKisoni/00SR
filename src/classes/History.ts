interface HistoryArgs {
  storeId: string;
  productId: string;
}

export class History implements Types.IHistoryDocument {
  productId: string;
  storeId: string;
  evolutions: Types.IEvolution[];
  createdAt?: string | undefined;

  constructor({ storeId, productId }: HistoryArgs) {
    const now = new Date();
    this.storeId = storeId;
    this.productId = productId;
    this.evolutions = [];
    this.createdAt = now.toISOString();
  }

  generateDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    const fullDate = `${y}-${m}-${d}`;
    return fullDate;
  }

  addEvolution(quantity: number): Types.IHistoryDocument {
    const date = this.createdAt ? new Date(this.createdAt) : new Date();
    const evolution: Types.IEvolution = {
      date,
      dateKey: this.generateDateKey(date),
      quantity,
    };
    this.evolutions = [evolution];
    return this;
  }

  toObject(): Types.IHistoryDocument {
    return {
      storeId: this.storeId,
      createdAt: this.createdAt,
      productId: this.productId,
      evolutions: this.evolutions,
    };
  }
}
