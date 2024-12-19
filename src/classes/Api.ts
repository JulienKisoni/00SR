import type { Dispatch, UnknownAction } from "redux";
import { GenericError } from "./GenericError";

export interface GenericResponse<T> {
  data?: T | null;
  error?: GenericError;
}

export abstract class Api {
  abstract endpoint?: string;
  abstract dispatch: Dispatch<UnknownAction>;

  abstract addOne<
    T extends
      | Types.IUserDocument
      | Types.IStoreDocument
      | Types.IProductDocument
  >(payload: T): GenericResponse<void>;

  abstract getOne<
    T extends
      | Types.IUserDocument
      | Types.IStoreDocument
      | Types.IProductDocument
  >(filters: { [key: string]: string }): GenericResponse<T>;
  //   abstract getMany: <T, U>(filters?: T) => U[];

  abstract updateOne<T extends Types.IUserDocument | Types.IStoreDocument>(
    id: string,
    payload: Partial<T>
  ): GenericResponse<T>;

  abstract deleteOne(id: string, ...extraArgs: any[]): GenericResponse<void>;
  //   abstract deleteMany: (ids: string[]) => void;
}
