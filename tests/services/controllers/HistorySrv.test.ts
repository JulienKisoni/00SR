/// <reference path="../../../src/types/global.d.ts" />

import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

import { ProductSrv } from "../../../src/services/controllers/ProductSrv";
import { HistorySrv } from "../../../src/services/controllers/HistorySrv";
import store from "../../../src/services/redux/store";

let mockDispatch: Dispatch<UnknownAction>;
let productSrv: ProductSrv;

describe("HistorySrv class", () => {
  beforeEach(() => {
    mockDispatch = jest
      .fn<Dispatch<any>>()
      .mockImplementation((action: any) => action);
    productSrv = new ProductSrv(mockDispatch);
  });
  describe("addOne", () => {
    test("Should return error", () => {
      const actualStore = store.getState();
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        products: [],
        histories: [],
      });
      const historySrv = new HistorySrv(mockDispatch, productSrv);
      const history: Types.IHistoryDocument = {
        productId: "789",
        productName: "name",
        evolutions: [],
        storeId: "123",
        createdAt: new Date().toISOString(),
      };
      const result = historySrv.addOne(history);
      expect(result.error).toBeDefined();
    });
  });
  describe("getOne", () => {
    test("Should work", () => {
      const actualStore = store.getState();
      const history: Types.IHistoryDocument = {
        productId: "789",
        productName: "name",
        evolutions: [],
        storeId: "123",
        createdAt: new Date().toISOString(),
      };
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        products: [],
        histories: [history],
      });
      const historySrv = new HistorySrv(mockDispatch, productSrv);
      const result = historySrv.getOne({ productId: "789" });
      expect(result.data).toBeDefined();
      expect(result.error).toBeUndefined();
    });
  });
  describe("updateOne", () => {
    test("Should return error", () => {
      const actualStore = store.getState();
      const history: Types.IHistoryDocument = {
        productId: "789",
        productName: "name",
        evolutions: [],
        storeId: "123",
        createdAt: new Date().toISOString(),
      };
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        products: [],
        histories: [history],
      });
      const historySrv = new HistorySrv(mockDispatch, productSrv);
      const result = historySrv.updateOne("789", { dateKey: "" });
      expect(result.error).toBeDefined();
    });
  });
});
