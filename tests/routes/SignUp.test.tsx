/// <reference path="../../src/types/global.d.ts" />

import React from "react";
import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import { act } from "@testing-library/react";

import { renderWithProviders } from "../helpers/renderers";
import SignUpCtrl from "../../src/components/controllers/SignUpCtrl";

describe.only("SignUp Feature", () => {
  describe("User can sign up with email and password", () => {
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<SignUpCtrl />);
      });
    });
  });
});
