/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../src/types/global.d.ts" />

import React from "react";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNotifications } from "@toolpad/core";
import { useNavigate } from "react-router";

import { renderWithProviders } from "../helpers/renderers";
import SignUpCtrl from "../../src/components/controllers/SignUpCtrl";
import { ROUTES } from "../../src/constants/routes";
import { generateFakeStore } from "../helpers/fakers";

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

describe("SignUp Feature", () => {
  describe("User can sign up with email and password", () => {
    test("should work", async () => {
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
      mockedUseNavigate.mockReturnValue(mockNavigate);
      await act(async () => {
        renderWithProviders(<SignUpCtrl />);
      });
      let signupBtn: HTMLElement;
      await act(async () => {
        const email = await screen.findByTestId("email-address");
        const password = await screen.findByTestId("password");
        const repeatPassword = await screen.findByTestId("repeat-password");
        signupBtn = await screen.findByTestId("signup-btn");
        expect(signupBtn).toBeDisabled();
        userEvent.type(email, "johndoe@mail.com");
        userEvent.type(password, "johndoe");
        userEvent.type(repeatPassword, "johndoe");
      });
      await waitFor(async () => {
        expect(signupBtn).toBeEnabled();
      });
      await act(async () => {
        userEvent.click(signupBtn);
      });
      expect(mockShow).toHaveBeenCalledWith("Account created successfully", {
        autoHideDuration: 5000,
        severity: "success",
      });
      expect(mockNavigate).toHaveBeenCalledWith(`/${ROUTES.SIGNIN}`);
    });
  });
  describe("User cannot sign up with already used email", () => {
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
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
      mockedUseNavigate.mockReturnValue(mockNavigate);
      await act(async () => {
        renderWithProviders(<SignUpCtrl />, { preloadedState: state });
      });
      let signupBtn: HTMLElement;
      await act(async () => {
        const email = await screen.findByTestId("email-address");
        const password = await screen.findByTestId("password");
        const repeatPassword = await screen.findByTestId("repeat-password");
        signupBtn = await screen.findByTestId("signup-btn");
        expect(signupBtn).toBeDisabled();
        userEvent.type(email, "johndoe@mail.com");
        userEvent.type(password, "johndoe");
        userEvent.type(repeatPassword, "johndoe");
      });
      await waitFor(async () => {
        expect(signupBtn).toBeEnabled();
      });
      await act(async () => {
        userEvent.click(signupBtn);
      });
      expect(mockShow).toHaveBeenCalledWith("User already exist", {
        autoHideDuration: 5000,
        severity: "error",
      });
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
