/// <reference path="../../src/types/global.d.ts" />

import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import { UnknownAction, Dispatch } from "@reduxjs/toolkit";

import { Cart, CartItem } from "../../src/classes/Cart";
import { ProductSrv } from "../../src/services/controllers/ProductSrv";
import { GenericError } from "../../src/classes/GenericError";

const error = new GenericError("Something went wrong");
const productId = "1234";
const quantity = 50;
let mockDispatch: Dispatch<UnknownAction>;
let productSrv: ProductSrv;

describe("CART ITEM CLASS", () => {
  beforeEach(() => {
    mockDispatch = jest.fn((action: any) => action);
    productSrv = new ProductSrv(mockDispatch);
  });
  describe("calculateTotalPrice", () => {
    const mockGetOneProduct = jest
      .spyOn(ProductSrv.prototype, "getOne")
      .mockReturnValue({ error, data: null });
    test("Should be zero", () => {
      const cartItem = new CartItem("1234", quantity);
      cartItem.calculateTotalPrice(productSrv);
      expect(cartItem.totalPrice).toBe(0);
      expect(mockGetOneProduct).toBeCalledWith({ productId });
    });
  });
  describe("toObject", () => {
    test("Should return object", () => {
      const cartItem = new CartItem("1234", quantity);
      const item = cartItem.toObject();
      expect(item).toMatchObject({ productId: "1234", quantity: 50 });
    });
  });
});

describe("CART CLASS", () => {
  describe("constructor", () => {
    test("Should throw error", () => {
      expect(() => new Cart({})).toThrowError("Could no initialize Cart");
    });
  });
  describe("calculateTotalPrices", () => {
    test("Should add items", () => {
      const cart = new Cart({ storeId: "1234", userId: "abc" });
      const mockCalculateTotalPrices = jest.spyOn(cart, "calculateTotalPrices");
      const items: Types.CartItem[] = [
        {
          productId,
          quantity,
          totalPrice: 80,
        },
        {
          productId: "1BCD",
          quantity: 43,
          totalPrice: 90,
        },
        {
          productId: "1BCE",
          quantity: 13,
          totalPrice: 100,
        },
      ];
      cart.addItems(items);
      expect(cart.totalPrices).toBe(270);
      expect(mockCalculateTotalPrices).toBeCalled();
    });
  });
  describe("toObject", () => {
    test("Should return value", () => {
      const cart = new Cart({ storeId: "1234", userId: "abc" });
      const items: Types.CartItem[] = [
        {
          productId,
          quantity,
          totalPrice: 80,
        },
        {
          productId: "1BCD",
          quantity: 43,
          totalPrice: 90,
        },
        {
          productId: "1BCE",
          quantity: 13,
          totalPrice: 100,
        },
      ];
      cart.addItems(items);
      const object = cart.toObject();
      expect(object.cartId).toBeDefined();
      expect(object).toMatchObject({
        storeId: "1234",
        userId: "abc",
        totalPrices: 270,
        items,
      });
    });
  });
  describe("updateItemQty", () => {
    test("Should work", () => {
      const cart = new Cart({ storeId: "1234", userId: "abc" });
      const mockCalculateTotalPrices = jest.spyOn(cart, "calculateTotalPrices");
      const items: Types.CartItem[] = [
        {
          productId,
          quantity,
          totalPrice: 80,
        },
        {
          productId: "1BCD",
          quantity: 43,
          totalPrice: 90,
        },
        {
          productId: "1BCE",
          quantity: 13,
          totalPrice: 100,
        },
      ];
      cart.addItems(items);
      cart.updateItemQty(productId, 3);
      expect(mockCalculateTotalPrices).toBeCalledTimes(2);
    });
  });
});
