import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

import { Api, GenericResponse } from "../../classes/Api";
import {
  createGraphic,
  updateGraphic,
  deleteGraphic,
  deleteGraphics,
} from "../redux/slices/graphics";
import { getStore } from "../redux/store";
import { GenericError } from "../../classes/GenericError";

const store = getStore();

export class GraphicSrv extends Api {
  dispatch: Dispatch<UnknownAction>;
  endpoint?: string | undefined;

  constructor(dispatch: Dispatch<UnknownAction>, endpoint?: string) {
    super();
    this.dispatch = dispatch;
    this.endpoint = endpoint;
  }

  addOne<
    T extends
      | Types.IUserDocument
      | Types.IStoreDocument
      | Types.IProductDocument
      | Types.IGraphicDocument,
  >(payload: T): GenericResponse<void> {
    const _graphic = store
      .getState()
      .graphics.find((r) => r._id === payload._id);
    if (_graphic) {
      const error = new GenericError(
        "Something went wrong with graphic creation"
      );
      return { error };
    }
    this.dispatch(createGraphic({ data: payload as Types.IGraphicDocument }));
    return { data: null, error: undefined };
  }
  getOne<
    T extends
      | Types.IUserDocument
      | Types.IStoreDocument
      | Types.IProductDocument
      | Types.IGraphicDocument,
  >({ graphicId }: { graphicId: string }): GenericResponse<T> {
    const graphic = store
      .getState()
      .graphics.find((gr) => gr._id === graphicId);
    if (graphic) {
      return { error: undefined, data: graphic as T };
    }
    return { error: new GenericError("No graphic found") };
  }
  updateOne<T extends Types.IUserDocument | Types.IStoreDocument>(
    id: string,
    payload: Partial<T>
  ): GenericResponse<T> {
    this.dispatch(updateGraphic({ graphicId: id, payload }));
    return { error: undefined };
  }

  deleteOne(id: string): GenericResponse<void> {
    const { error } = this.getOne<Types.IGraphicDocument>({
      graphicId: id,
    });
    if (error) {
      return { error };
    }
    this.dispatch(deleteGraphic({ graphicId: id }));
    return { error: undefined };
  }
  deleteMany(graphicIDs: string[]): GenericResponse<void> {
    this.dispatch(deleteGraphics({ graphicIDs }));
    return { error: undefined };
  }
}
