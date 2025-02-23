/// <reference path="../../src/types/global.d.ts" />

import { describe, expect, test } from "@jest/globals";
import { Store } from "../../src/classes/Store";

interface FormValues {
  line1: string;
  line2?: string;
  country: string;
  state: string;
  city: string;
  name: string;
  description: string;
}

describe("Store class", () => {
  describe("Compare with old", () => {
    test("Should return difference", () => {
      const newValues: FormValues = {
        line1: "street",
        line2: "street2",
        country: "CANADA",
        state: "QC",
        city: "Montreal",
        name: "My store",
        description: "description",
      };
      const oldValues: FormValues = {
        line1: "street",
        country: "CANADA",
        state: "QC",
        city: "Montreal",
        name: "My store",
        description: "description",
      };
      const newStore = new Store({
        values: newValues,
        owner: "123",
        picture: "picture_uri",
        products: [],
      });
      const oldStore = new Store({
        values: oldValues,
        owner: "123",
        picture: "picture_uri",
        products: [],
      });
      const diff = newStore.compareWithOld(oldStore);
      expect(diff.address?.line2).toBe("street2");
    });
  });
});
