/// <reference path="../../../src/types/global.d.ts" />

import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

import { getStore } from "../../../src/services/redux/store";
import { ProductSrv } from "../../../src/services/controllers/ProductSrv";

const store = getStore();
let mockDispatch: Dispatch<UnknownAction>;

describe("ProductSrv class", () => {
  beforeEach(() => {
    mockDispatch = jest
      .fn<Dispatch<any>>()
      .mockImplementation((action: any) => action);
  });
  describe("addOne", () => {
    test("Should return error", () => {
      const product: Types.IProductDocument = {
        _id: "123",
        name: "name",
        key: "key",
        quantity: 5,
        storeId: "abc",
        description: "description",
        minQuantity: 2,
        owner: "xyz",
        active: true,
        unitPrice: 50,
        reviews: [],
        picture: "picture_uri",
        createdAt: new Date().toISOString(),
      };
      const _store: Types.IStoreDocument = {
        _id: "abc",
        name: "name",
        owner: "xyz",
        picture: "picture_uri",
        products: ["123"],
        description: "description",
        address: {} as Types.Address,
        active: true,
        createdAt: new Date().toISOString(),
      };
      const actualStore = store.getState();
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        stores: [_store],
        products: [],
      });
      const productSrv = new ProductSrv(mockDispatch);
      const result = productSrv.addOne(product);
      expect(result.error).toBeDefined();
    });
  });
  describe("getOne", () => {
    test("should return undefined data", () => {
      const actualStore = store.getState();
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        stores: [],
        products: [],
      });
      const productSrv = new ProductSrv(mockDispatch);
      const result = productSrv.getOne({ productId: "123" });
      expect(result.data).toBeUndefined();
    });
  });
  describe("deleteOne", () => {
    test("should return error", () => {
      const actualStore = store.getState();
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        stores: [],
        products: [],
      });
      const productSrv = new ProductSrv(mockDispatch);
      const result = productSrv.deleteOne("123");
      expect(result.error).toBeDefined();
    });
  });
});
