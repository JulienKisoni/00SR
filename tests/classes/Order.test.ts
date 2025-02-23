/// <reference path="../../src/types/global.d.ts" />

import { describe, expect, test, jest } from "@jest/globals";
import { Order } from "../../src/classes/Order";

describe("Order Class", () => {
  describe("Constructor", () => {
    test("Should be called", () => {
      const cartItems: Types.CartItem[] = [
        {
          productId: "123",
          quantity: 10,
          totalPrice: 50,
        },
        {
          productId: "234",
          quantity: 20,
          totalPrice: 40,
        },
        {
          productId: "789",
          quantity: 5,
          totalPrice: 60,
        },
      ];
      const mockRefreshItems = jest
        .spyOn(Order.prototype, "refreshProductItems")
        .mockImplementation((items) => items);
      const mockGenerateOrderNumber = jest.spyOn(
        Order.prototype,
        "generateOrderNumber"
      );
      const mockCalculateTotalPrice = jest.spyOn(
        Order.prototype,
        "calculateTotalPrice"
      );
      new Order({
        storeId: "123",
        userId: "456",
        cartItems,
      });

      expect(mockRefreshItems).toBeCalled();
      expect(mockGenerateOrderNumber).toBeCalled();
      expect(mockCalculateTotalPrice).toBeCalled();
    });
  });
});
