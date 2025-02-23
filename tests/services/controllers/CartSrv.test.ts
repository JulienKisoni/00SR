/// <reference path="../../../src/types/global.d.ts" />

import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";

import store from "../../../src/services/redux/store";
import { CartSrv } from "../../../src/services/controllers/CartSrv";

let mockDispatch: Dispatch<UnknownAction>;

describe("CartSrv class", () => {
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
        cart: {
          "123": {
            abc: undefined,
          },
        },
      });
      const cartSrv = new CartSrv(mockDispatch);
      const result = cartSrv.getOne({ userId: "123", storeId: "abc" });
      expect(result.error).toBeDefined();
      expect(result.error?.publicMessage).toBe(
        "No existing cart for this user"
      );
    });
  });
  describe("addItems", () => {
    test("Should call setCart", () => {
      const actualStore = store.getState();
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        cart: {
          "123": {
            abc: undefined,
          },
        },
      });
      const mockSetCart = jest.spyOn(CartSrv.prototype, "setCart");
      const cartSrv = new CartSrv(mockDispatch);
      const cart: Types.Cart = {
        storeId: "abc",
        userId: "123",
        totalPrices: 100,
        items: [],
        cartId: "xyz",
      };
      cartSrv.addItems({ userId: "123", storeId: "abc", data: cart });
      expect(mockSetCart).toBeCalled();
    });
  });
  describe("deleteOne", () => {
    test("Should return error", () => {
      const actualStore = store.getState();
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        cart: {
          "123": {
            abc: undefined,
          },
        },
      });
      const cartSrv = new CartSrv(mockDispatch);
      const result = cartSrv.deleteOne("123", "5555");
      expect(result.error).toBeDefined();
    });
  });
  describe("updateQty", () => {
    test("Should return error", () => {
      const actualStore = store.getState();
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        cart: {
          "123": {
            abc: undefined,
          },
        },
      });
      const cartSrv = new CartSrv(mockDispatch);
      const result = cartSrv.updateQty({
        userId: "123",
        storeId: "abc",
        qty: 3,
        productId: "789",
      });
      expect(result.error).toBeDefined();
    });
  });
  describe("removeProducts", () => {
    test("Should return error", () => {
      const actualStore = store.getState();
      jest.spyOn(store, "getState").mockReturnValueOnce({
        ...actualStore,
        cart: {
          "123": {
            abc: undefined,
          },
        },
      });
      const cartSrv = new CartSrv(mockDispatch);
      const result = cartSrv.removeProducts({
        userId: "123",
        storeId: "abc",
        productIDs: ["789"],
      });
      expect(result.error).toBeDefined();
    });
  });
});
