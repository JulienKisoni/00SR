/// <reference path="../../src/types/global.d.ts" />

import { describe, expect, test } from "@jest/globals";
import { History } from "../../src/classes/History";

describe("History Class", () => {
  describe("toObject", () => {
    test("Should return value", () => {
      const history = new History({
        productId: "abc",
        storeId: "123",
        productName: "Shirt",
      });
      const object = history.toObject();
      expect(object.createdAt).toBeDefined();
      expect(object.evolutions).toBeDefined();
      expect(object).toMatchObject({
        productId: "abc",
        storeId: "123",
        productName: "Shirt",
        evolutions: [],
      });
    });
  });
});
