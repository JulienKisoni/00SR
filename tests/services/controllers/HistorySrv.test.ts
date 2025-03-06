/// <reference path="../../../src/types/global.d.ts" />

import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

import { ProductSrv } from "../../../src/services/controllers/ProductSrv";
import { HistorySrv } from "../../../src/services/controllers/HistorySrv";
import { getStore } from "../../../src/services/redux/store";

const store = getStore();
let mockDispatch: Dispatch<UnknownAction>;
let productSrv: ProductSrv;

describe("HistorySrv class", () => {
  beforeEach(() => {
    mockDispatch = jest
      .fn<Dispatch<any>>()
      .mockImplementation((action: any) => action);
    productSrv = new ProductSrv(mockDispatch);
  });
  describe("deleteOne", () => {
    test("Should throw error", () => {
      const actualStore = store.getState();
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        products: [],
        histories: [],
      });
      const historySrv = new HistorySrv(mockDispatch, productSrv);
      expect(() => historySrv.deleteOne("")).toThrowError(
        "Method not implemented"
      );
    });
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
    test("Should work", () => {
      const product1: Types.IProductDocument = {
        _id: "abcd",
        name: "My product 1",
        description: "My product description",
        storeId: "store._id",
        key: "KEY",
        quantity: 10,
        minQuantity: 5,
        unitPrice: 200,
        owner: "user._id",
        reviews: [],
        picture: "picture_uri",
        createdAt: new Date().toISOString(),
        active: true,
      };
      const product2: Types.IProductDocument = {
        _id: "abcde",
        name: "My product 2",
        description: "My product description",
        storeId: "store._id",
        key: "KEY",
        quantity: 10,
        minQuantity: 5,
        unitPrice: 200,
        owner: "user._id",
        reviews: [],
        picture: "picture_uri",
        createdAt: new Date().toISOString(),
        active: true,
      };
      const evolutions: Types.IEvolution[] = [
        {
          date: new Date().toISOString(),
          dateKey: "dateKey1",
          quantity: 50,
        },
        {
          date: new Date().toISOString(),
          dateKey: "dateKey1",
          quantity: 50,
        },
      ];
      const history1: Types.IHistoryDocument = {
        productId: product1._id,
        productName: product1.name,
        evolutions,
        storeId: "store._id",
        createdAt: new Date().toISOString(),
      };
      const history2: Types.IHistoryDocument = {
        productId: product2._id,
        productName: product2.name,
        evolutions,
        storeId: "store._id",
        createdAt: new Date().toISOString(),
      };
      const actualStore = store.getState();
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        products: [product1, product2],
        histories: [history1, history2],
      });
      const historySrv = new HistorySrv(mockDispatch, productSrv);
      const history: Types.IHistoryDocument = {
        productId: product2._id,
        productName: product2.name,
        evolutions: [
          {
            date: new Date().toISOString(),
            dateKey: "dateKey3",
            quantity: 50,
          },
        ],
        storeId: "123",
        createdAt: new Date().toISOString(),
      };
      const result = historySrv.addOne(history);
      expect(result.error).toBeUndefined();
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
      const data: Types.IEvolution = {
        date: new Date().toISOString(),
        dateKey: "dateKey1",
        quantity: 50,
      };
      const result = historySrv.updateOne("789", { dateKey: "dateKey1", data });
      expect(result.error).toBeUndefined();
    });
  });
});
