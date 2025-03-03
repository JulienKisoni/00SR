import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

import { Api, GenericResponse } from "../../classes/Api";
import {
  createReport,
  updateReport,
  deleteReport,
  deleteReports,
} from "../redux/slices/reports";
import { getStore } from "../redux/store";
import { GenericError } from "../../classes/GenericError";

export class ReportSrv extends Api {
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
      | Types.IReportDocument,
  >(payload: T): GenericResponse<void> {
    const store = getStore();
    const _report = store.getState().reports.find((r) => r._id === payload._id);
    if (_report) {
      const error = new GenericError(
        "Something went wrong with report creation"
      );
      return { error };
    }
    this.dispatch(createReport({ data: payload as Types.IReportDocument }));
    return { data: null, error: undefined };
  }
  getOne<
    T extends
      | Types.IUserDocument
      | Types.IStoreDocument
      | Types.IProductDocument
      | Types.IReportDocument,
  >({ reportId }: { reportId: string }): GenericResponse<T> {
    const store = getStore();
    const report = store.getState().reports.find((rep) => rep._id === reportId);
    return { error: undefined, data: report as T };
  }
  updateOne<T extends Types.IUserDocument | Types.IStoreDocument>(
    id: string,
    payload: Partial<T>
  ): GenericResponse<T> {
    this.dispatch(updateReport({ reportId: id, payload }));
    return { error: undefined };
  }

  deleteOne(id: string): GenericResponse<void> {
    const { error, data } = this.getOne<Types.IReportDocument>({
      reportId: id,
    });
    if (error || !data) {
      return { error: error || new GenericError("No existing order") };
    }
    this.dispatch(deleteReport({ reportId: id }));
    return { error: undefined };
  }
  deleteMany(reportIDs: string[]): GenericResponse<void> {
    this.dispatch(deleteReports({ reportIDs }));
    return { error: undefined };
  }
}
