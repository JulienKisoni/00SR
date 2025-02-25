/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../src/types/global.d.ts" />

import React from "react";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNotifications } from "@toolpad/core";
import { useNavigate } from "react-router";

import { renderWithProviders } from "../helpers/renderers";
import { ROUTES } from "../../src/constants/routes";
import { generateFakeStore } from "../helpers/fakers";
import emailSrv from "../../src/services/email";
import ForgotPasswordCtrl from "../../src/components/controllers/ForgotPasswordCtrl";
import { RootState } from "../../src/services/redux/rootReducer";

let state: RootState;

const mockShow = jest.fn();
const mockNavigate = jest.fn();

jest.mock("@toolpad/core", () => ({
  useNotifications: jest.fn(),
}));
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: jest.fn(),
}));

const mockedUseNotifications = jest.mocked(useNotifications);
const mockedUseNavigate = jest.mocked(useNavigate);
const mockSendEmail = jest
  .spyOn(emailSrv, "send")
  .mockImplementation(async ({ from_name, to_email, to_name, message }) => {
    return Promise.resolve({ status: 1, text: "OK" });
  });

describe("Recover password Feature", () => {
  describe("User can recover his password with valid email", () => {
    beforeEach(() => {
      const users: Types.IUserDocument[] = [
        {
          _id: "123",
          email: "johndoe@mail.com",
          password: "johndoe",
          profile: {
            username: "johndoe",
            picture: "picture_uri",
            role: "user",
          },
          createdAt: new Date().toISOString(),
        },
      ];
      state = generateFakeStore({ users });
    });
    test("should work", async () => {
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
      mockedUseNavigate.mockReturnValue(mockNavigate);
      await act(async () => {
        renderWithProviders(<ForgotPasswordCtrl />, { preloadedState: state });
      });
      let submitBtn: HTMLElement;
      await act(async () => {
        const email = await screen.findByTestId("email-address");
        submitBtn = await screen.findByTestId("submit-btn");
        expect(submitBtn).toBeDisabled();
        userEvent.type(email, "johndoe@mail.com");
      });
      await waitFor(async () => {
        expect(submitBtn).toBeEnabled();
      });
      await act(async () => {
        userEvent.click(submitBtn);
      });

      await waitFor(async () => {
        expect(mockSendEmail).toHaveBeenCalled();
      });
      expect(mockShow).toHaveBeenCalledWith("Email sent", {
        autoHideDuration: 5000,
        severity: "success",
      });
      expect(mockNavigate).toHaveBeenCalledWith(`/${ROUTES.SIGNIN}`);
    });
  });
  describe("User cannot recover his password with non-existing email", () => {
    beforeEach(() => {
      const users: Types.IUserDocument[] = [
        {
          _id: "123",
          email: "johndoe@mail.com",
          password: "johndoe",
          profile: {
            username: "johndoe",
            picture: "picture_uri",
            role: "user",
          },
          createdAt: new Date().toISOString(),
        },
      ];
      state = generateFakeStore({ users });
    });
    test("should work", async () => {
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
      mockedUseNavigate.mockReturnValue(mockNavigate);
      await act(async () => {
        renderWithProviders(<ForgotPasswordCtrl />, { preloadedState: state });
      });
      let submitBtn: HTMLElement;
      await act(async () => {
        const email = await screen.findByTestId("email-address");
        submitBtn = await screen.findByTestId("submit-btn");
        expect(submitBtn).toBeDisabled();
        userEvent.type(email, "johndoe1@mail.com");
      });
      await waitFor(async () => {
        expect(submitBtn).toBeEnabled();
      });
      await act(async () => {
        userEvent.click(submitBtn);
      });

      expect(mockSendEmail).not.toHaveBeenCalled();
      expect(mockShow).toHaveBeenCalledWith("No user found", {
        autoHideDuration: 5000,
        severity: "error",
      });
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
