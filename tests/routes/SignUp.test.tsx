/// <reference path="../../src/types/global.d.ts" />

import React from "react";
import { act, screen } from "@testing-library/react";

import { renderWithProviders } from "../helpers/renderers";
import SignUpCtrl from "../../src/components/controllers/SignUpCtrl";

describe.only("SignUp Feature", () => {
  describe("User can sign up with email and password", () => {
    test("should work", async () => {
      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(async () => {
        renderWithProviders(<SignUpCtrl />);
      });
      const email = await screen.findByTestId("email-address");
      expect(email).toBeInTheDocument();
    });
  });
});
