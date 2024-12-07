export abstract class Api {
  abstract endpoint?: string;

  abstract addOne<T extends Types.IUserDocument>(payload: T): void;

  //   abstract getOne: <T>(id: string) => T;
  //   abstract getMany: <T, U>(filters?: T) => U[];

  //   abstract updateOne: <T>(id: string, payload: Partial<T>) => T;

  //   abstract deleteOne: (id: string) => void;
  //   abstract deleteMany: (ids: string[]) => void;
}
