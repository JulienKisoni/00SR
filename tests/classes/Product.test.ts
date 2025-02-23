/// <reference path="../../src/types/global.d.ts" />

import { describe, expect, test } from "@jest/globals";
import { Product } from "../../src/classes/Product";

describe("Product class", () => {
  describe("Compare with old", () => {
    test("Should return difference", () => {
      const values = {
        name: "Name",
        description: "description",
        minQuantity: 5,
        unitPrice: 40,
        quantity: 10,
      };
      const product = new Product({
        values,
        owner: "123",
        picture: "picture_uri",
        storeId: "789",
      });
      const oldValues = {
        name: "Name 2",
        description: "description",
        minQuantity: 5,
        unitPrice: 40,
        quantity: 20,
      };
      const diff = product.compareWithOld(oldValues);
      expect(diff).toMatchObject({
        name: "Name",
        quantity: 10,
      });
    });
  });
});
