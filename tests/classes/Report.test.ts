/// <reference path="../../src/types/global.d.ts" />

import { describe, expect, test } from "@jest/globals";
import { Report } from "../../src/classes/Report";

describe("Report class", () => {
  describe("Compare with old", () => {
    test("Should return difference", () => {
      const report = new Report({
        storeId: "123",
        userId: "456",
        name: "Report 2",
        description: "Description 2",
        orders: [],
        reportId: "789",
      });
      const oldValues = {
        name: "Report 2",
        description: "Description 2",
      };
      const diff = report.compareWithOld(oldValues);
      expect(Object.values(diff).length).toBe(0);
    });
  });
});
