import type { Dispatch, UnknownAction } from "redux";

export abstract class Api {
  abstract endpoint?: string;
  abstract dispatch: Dispatch<UnknownAction>;

  abstract addOne<T extends Types.IUserDocument>(payload: T): void;

  abstract getOne<T extends Types.IUserDocument>(filters: {
    [key: string]: string;
  }): T | null;
  //   abstract getMany: <T, U>(filters?: T) => U[];

  //   abstract updateOne: <T>(id: string, payload: Partial<T>) => T;

  //   abstract deleteOne: (id: string) => void;
  //   abstract deleteMany: (ids: string[]) => void;
}
