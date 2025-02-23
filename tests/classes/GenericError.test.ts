/// <reference path="../../src/types/global.d.ts" />

import { describe, expect, test } from "@jest/globals";
import { GenericError } from "../../src/classes/GenericError";

describe("GenericError Class", () => {
  test("Should have public message", () => {
    const error = new GenericError("msg", "public");
    expect(error.publicMessage).toBe("public");
  });
});
