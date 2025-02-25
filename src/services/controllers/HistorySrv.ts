import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

import { Api, GenericResponse } from "../../classes/Api";
import { createHistory, updateHistory } from "../redux/slices/histories";
import { getStore } from "../redux/store";
import { GenericError } from "../../classes/GenericError";
import { ProductSrv } from "./ProductSrv";
import { History } from "../../classes/History";

const store = getStore();

export class HistorySrv extends Api {
  deleteOne(id: string, ...extraArgs: any[]): GenericResponse<void> {
    throw new Error("Method not implemented.");
  }
  dispatch: Dispatch<UnknownAction>;
  endpoint?: string | undefined;
  productSrv: ProductSrv;

  constructor(
    dispatch: Dispatch<UnknownAction>,
    productSrv: ProductSrv,
    endpoint?: string
  ) {
    super();
    this.dispatch = dispatch;
    this.endpoint = endpoint;
    this.productSrv = productSrv;
  }

  addOne<
    T extends
      | Types.IUserDocument
      | Types.IStoreDocument
      | Types.IProductDocument
      | Types.IHistoryDocument,
  >(_payload: T): GenericResponse<void> {
    const payload = _payload as Types.IHistoryDocument;
    const { data: historyData } = this.getOne({ productId: payload.productId });
    if (!historyData) {
      const { error, data: productData } =
        this.productSrv.getOne<Types.IProductDocument>({
          productId: payload.productId,
        });
      if (error) {
        return { error };
      } else if (productData) {
        const history = new History(payload);
        history.unshiftEvolution(
          productData?.quantity,
          new Date(productData.createdAt)
        );
        this.dispatch(createHistory({ data: history.toObject() }));
      } else {
        const error = new GenericError("Could not add history");
        return { data: undefined, error };
      }
    } else {
      this.updateOne(payload.productId, {
        dateKey: payload.evolutions[0].dateKey,
        data: payload.evolutions[0],
      });
    }
    return { data: null, error: undefined };
  }
  getOne<
    T extends
      | Types.IUserDocument
      | Types.IStoreDocument
      | Types.IProductDocument
      | Types.IHistoryDocument,
  >({ productId }: { productId: string }): GenericResponse<T> {
    const history = store
      .getState()
      .histories.find((_history) => _history.productId === productId);
    return { error: undefined, data: history as T };
  }
  updateOne<
    T extends
      | Types.IUserDocument
      | Types.IStoreDocument
      | { dateKey: string; data: Types.IEvolution },
  >(productId: string, payload: Partial<T>): GenericResponse<T> {
    const _payload = payload as Partial<{
      dateKey: string;
      data: Types.IEvolution;
    }>;
    const { data, dateKey } = _payload;
    if (data && dateKey) {
      this.dispatch(
        updateHistory({ productId, dateKey: dateKey, payload: data })
      );
      return { error: undefined };
    } else {
      const error = new GenericError("Missing arguments");
      return { error };
    }
  }
}
