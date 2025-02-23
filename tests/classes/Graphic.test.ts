/// <reference path="../../src/types/global.d.ts" />

import { describe, expect, test } from "@jest/globals";
import { Graphic } from "../../src/classes/Graphic";

describe("Graphic Class", () => {
  describe("toObject", () => {
    test("Should return value", () => {
      const graphic = new Graphic({
        storeId: "123",
        userId: "abc",
        name: "xyz",
        description: "description",
        products: [],
        graphicId: "456",
      });
      const object = graphic.toObject();
      expect(object.createdAt).toBeDefined();
      expect(object).toMatchObject({
        storeId: "123",
        owner: "abc",
        name: "xyz",
        description: "description",
        products: [],
        _id: "456",
      });
    });
  });
});
