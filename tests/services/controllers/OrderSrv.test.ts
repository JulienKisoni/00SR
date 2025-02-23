/// <reference path="../../../src/types/global.d.ts" />

import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

import store from "../../../src/services/redux/store";
import { OrderSrv } from "../../../src/services/controllers/OrderSrv";

let mockDispatch: Dispatch<UnknownAction>;

describe("OrderSrv class", () => {
  beforeEach(() => {
    mockDispatch = jest
      .fn<Dispatch<any>>()
      .mockImplementation((action: any) => action);
  });

  describe("getOne", () => {
    test("Should return error", () => {
      const actualStore = store.getState();
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        orders: [],
      });
      const orderSrv = new OrderSrv(mockDispatch);
      const result = orderSrv.getOne({ orderId: "123" });
      expect(result.error).toBeDefined();
    });
  });
  describe("deleteOne", () => {
    test("Should return error", () => {
      const actualStore = store.getState();
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        orders: [],
      });
      const orderSrv = new OrderSrv(mockDispatch);
      const result = orderSrv.deleteOne("123");
      expect(result.error).toBeDefined();
    });
  });
});
