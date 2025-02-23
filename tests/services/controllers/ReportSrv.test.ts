/// <reference path="../../../src/types/global.d.ts" />

import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

import store from "../../../src/services/redux/store";
import { ReportSrv } from "../../../src/services/controllers/ReportSrv";

let mockDispatch: Dispatch<UnknownAction>;

describe("ReportSrv class", () => {
  beforeEach(() => {
    mockDispatch = jest
      .fn<Dispatch<any>>()
      .mockImplementation((action: any) => action);
  });
  describe("addOne", () => {
    test("should return error", () => {
      const report: Types.IReportDocument = {
        _id: "abc",
        name: "name",
        description: "description",
        owner: "xyz",
        storeId: "123",
        orders: [],
        createdAt: new Date().toISOString(),
      };
      const actualStore = store.getState();
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        reports: [report],
      });
      const reportSrv = new ReportSrv(mockDispatch);
      const result = reportSrv.addOne(report);
      expect(result.error).toBeDefined();
    });
  });
  describe("getOne", () => {
    test("should return undefined data", () => {
      const actualStore = store.getState();
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        reports: [],
      });
      const reportSrv = new ReportSrv(mockDispatch);
      const result = reportSrv.getOne({ reportId: "123" });
      expect(result.data).toBeUndefined();
    });
  });
  describe("deleteOne", () => {
    test("should return error", () => {
      const actualStore = store.getState();
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        reports: [],
      });
      const reportSrv = new ReportSrv(mockDispatch);
      const result = reportSrv.deleteOne("123");
      expect(result.error).toBeDefined();
    });
  });
});
