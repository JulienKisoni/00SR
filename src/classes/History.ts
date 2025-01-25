interface HistoryArgs {
  storeId: string;
  productId: string;
  createdAt?: string;
  evolutions?: Types.IEvolution[];
}

export class History implements Types.IHistoryDocument {
  productId: string;
  storeId: string;
  evolutions: Types.IEvolution[];
  createdAt: string;

  constructor({ storeId, productId, createdAt, evolutions }: HistoryArgs) {
    const now = new Date();
    this.storeId = storeId;
    this.productId = productId;
    this.evolutions = evolutions || [];
    this.createdAt = createdAt || now.toISOString();
  }

  generateDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    const fullDate = `${y}-${m}-${d}`;
    return fullDate;
  }

  isNewDateKey(dateKey: string): boolean {
    return !this.evolutions.some((evolution) => evolution.dateKey === dateKey);
  }

  pushEvolution(quantity: number): Types.IHistoryDocument {
    const date = this.createdAt ? new Date(this.createdAt) : new Date();
    const dateKey = this.generateDateKey(date);
    const evolution: Types.IEvolution = {
      date: date.toISOString(),
      dateKey,
      quantity,
    };
    this.evolutions.push(evolution);
    return this;
  }
  unshiftEvolution(quantity: number, date: Date): Types.IHistoryDocument {
    const dateKey = this.generateDateKey(date);
    if (this.isNewDateKey(dateKey)) {
      const evolution: Types.IEvolution = {
        date: date.toISOString(),
        dateKey,
        quantity,
      };
      this.evolutions.unshift(evolution);
    }
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
