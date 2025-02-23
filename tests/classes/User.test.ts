/// <reference path="../../src/types/global.d.ts" />

import { describe, expect, test } from "@jest/globals";
import { User } from "../../src/classes/User";

describe("User class", () => {
  describe("Constructor", () => {
    test("Should work", () => {
      const user = new User({
        email: "test",
        password: "test",
        createdAt: new Date().toISOString(),
      });
      expect(user._id).toBeDefined();
      expect(user.profile.role).toBeDefined();
    });
  });
});
