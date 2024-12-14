import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

import { Api, GenericResponse } from "../../classes/Api";
import { createStore } from "../redux/slices/stores";

export class StoreSrv extends Api {
  dispatch: Dispatch<UnknownAction>;
  endpoint?: string | undefined;

  constructor(dispatch: Dispatch<UnknownAction>, endpoint?: string) {
    super();
    this.dispatch = dispatch;
    this.endpoint = endpoint;
  }

  addOne<T extends Types.IUserDocument | Types.IStoreDocument>(
    payload: T
  ): GenericResponse<void> {
    const _id = uuidv4();
    const body = {
      ...payload,
      _id,
      createdAt: new Date().toISOString(),
    } as Types.IStoreDocument;
    this.dispatch(createStore({ data: body }));
    return { data: null, error: undefined };
  }
  getOne<T extends Types.IUserDocument | Types.IStoreDocument>(filters: {
    [key: string]: string;
  }): GenericResponse<T> {
    return { error: undefined };
  }
  updateOne<T extends Types.IUserDocument | Types.IStoreDocument>(
    id: string,
    payload: Partial<T>
  ): GenericResponse<T> {
    return { error: undefined };
  }
}
