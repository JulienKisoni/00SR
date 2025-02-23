/// <reference path="../../src/types/global.d.ts" />

import { describe, expect, test } from "@jest/globals";
import { FileUpload } from "../../src/classes/FileUpload";

describe("FileUpload class", () => {
  describe("base64ToBlob", () => {
    test("Should throw error", async () => {
      const fileUpload = new FileUpload("ref");
      const blob = await fileUpload.base64ToBlob("test");
      expect(blob).toBe(null);
    });
  });
});
