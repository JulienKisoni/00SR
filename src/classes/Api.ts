import type { Dispatch, UnknownAction } from "redux";
import { GenericError } from "./GenericError";

export interface GenericResponse<T> {
  data?: T | null;
  error?: GenericError;
}

export abstract class Api {
  abstract endpoint?: string;
  abstract dispatch: Dispatch<UnknownAction>;

  abstract addOne<T extends Types.IUserDocument>(
    payload: T
  ): GenericResponse<void>;

  abstract getOne<T extends Types.IUserDocument>(filters: {
    [key: string]: string;
  }): GenericResponse<T>;
  //   abstract getMany: <T, U>(filters?: T) => U[];

  //   abstract updateOne: <T>(id: string, payload: Partial<T>) => T;

  //   abstract deleteOne: (id: string) => void;
  //   abstract deleteMany: (ids: string[]) => void;
}
