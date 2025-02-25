/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../src/types/global.d.ts" />

import React from "react";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNotifications } from "@toolpad/core";
import { useNavigate } from "react-router";
import bcrypt from "bcryptjs";

import { renderWithProviders } from "../helpers/renderers";
import { ROUTES } from "../../src/constants/routes";
import { generateFakeStore } from "../helpers/fakers";
import SignInCtrl from "../../src/components/controllers/SignInCtrl";

const mockShow = jest.fn();
const mockNavigate = jest.fn();

jest.mock("@toolpad/core", () => ({
  useNotifications: jest.fn(() => ({
    show: jest.fn(),
    close: jest.fn(),
  })),
}));
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: jest.fn(),
}));

const mockedUseNotifications = jest.mocked(useNotifications);
const mockedUseNavigate = jest.mocked(useNavigate);

describe("SignIn Feature", () => {
  beforeEach(() => {
    mockedUseNotifications.mockReturnValue({
      show: mockShow,
      close: jest.fn(),
    });
    mockedUseNavigate.mockReturnValue(mockNavigate);
  });
  describe("User can sign in with valid credentials", () => {
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
    const state = generateFakeStore({ users });
    test("should work", async () => {
      const mockCompareSync = jest
        .spyOn(bcrypt, "compareSync")
        .mockImplementation(() => true);

      await act(async () => {
        renderWithProviders(<SignInCtrl />, { preloadedState: state });
      });
      let signinBtn: HTMLElement;

      await act(async () => {
        const email = await screen.findByTestId("email-address");
        const password = await screen.findByTestId("password");
        signinBtn = await screen.findByTestId("signin-btn");
        expect(signinBtn).toBeDisabled();
        userEvent.type(email, "johndoe@mail.com");
        userEvent.type(password, "johndoe");
      });

      await waitFor(async () => {
        expect(signinBtn).toBeEnabled();
      });

      await act(async () => {
        userEvent.click(signinBtn);
      });

      expect(mockCompareSync).toHaveBeenCalledTimes(1);
      //   expect(mockShow).toHaveBeenCalledWith("Login successful", {
      //     severity: "success",
      //     autoHideDuration: 5000,
      //   });
      expect(mockNavigate).toHaveBeenCalledWith(`/${ROUTES.STORES}`);
    });
  });
  describe("User cannot sign in with invalid credentials", () => {
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
    const state = generateFakeStore({ users });
    test("should work", async () => {
      const mockCompareSync = jest
        .spyOn(bcrypt, "compareSync")
        .mockImplementation(() => false);

      await act(async () => {
        renderWithProviders(<SignInCtrl />, { preloadedState: state });
      });
      let signinBtn: HTMLElement;

      await act(async () => {
        const email = await screen.findByTestId("email-address");
        const password = await screen.findByTestId("password");
        signinBtn = await screen.findByTestId("signin-btn");
        expect(signinBtn).toBeDisabled();
        userEvent.type(email, "johndoe@mail.com");
        userEvent.type(password, "johndoe123");
      });

      await waitFor(async () => {
        expect(signinBtn).toBeEnabled();
      });

      await act(async () => {
        userEvent.click(signinBtn);
      });

      expect(mockCompareSync).toHaveBeenCalledTimes(1);
      //   expect(mockShow).toHaveBeenCalledWith("User does not exist", {
      //     autoHideDuration: 5000,
      //     severity: "error",
      //   });
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
