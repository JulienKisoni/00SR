/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../../src/types/global.d.ts" />

import React from "react";
import { act, cleanup, screen, waitFor } from "@testing-library/react";
import { useNotifications } from "@toolpad/core";
import { useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";
import bcrypt from "bcryptjs";

import { RootState } from "../../../src/services/redux/rootReducer";
import { generateFakeStore } from "../../helpers/fakers";
import { renderWithProviders } from "../../helpers/renderers";
import UpdatePasswordCtrl from "../../../src/components/controllers/UpdatePasswordCtrl";

const mockShow = jest.fn();
const mockNavigate = jest.fn();

jest.mock("../../../src/services/workers/wrapper.ts", () => ({
  createWorker: jest.fn(),
}));
jest.mock("@toolpad/core", () => ({
  useNotifications: jest.fn(),
}));
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));
const mockedUseNotifications = jest.mocked(useNotifications);
const mockedUseNavigate = jest.mocked(useNavigate);

const user: Types.IUserDocument = {
  _id: "123",
  email: "johndoe@mail.com",
  password: "johndoe",
  profile: {
    username: "johndoe",
    picture: "picture_uri",
    role: "user",
  },
  createdAt: new Date().toISOString(),
};
const users: Types.IUserDocument[] = [user];
const store1: Types.IStoreDocument = {
  _id: "store1",
  name: "My store",
  owner: user._id,
  picture: "picture_uri",
  products: [],
  description: "My store description",
  address: {
    line1: "123 daddy street",
    country: "CANADA",
    state: "Québec",
    city: "Montreal",
  },
  active: true,
  createdAt: new Date().toISOString(),
};
const store2: Types.IStoreDocument = {
  _id: "store2",
  name: "My store",
  owner: user._id,
  picture: "picture_uri",
  products: [],
  description: "My store description",
  address: {
    line1: "123 daddy street",
    country: "CANADA",
    state: "Québec",
    city: "Montreal",
  },
  active: true,
  createdAt: new Date().toISOString(),
};
const stores = [store1, store2];

describe("Update Password Feature", () => {
  afterEach(() => {
    cleanup();
  });
  describe("User can update his password", () => {
    let state: RootState;
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        user: { connectedUser: user, selectedStore: store1 },
      });
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
    });
    test("should work", async () => {
      const mockCompareSync = jest
        .spyOn(bcrypt, "compareSync")
        .mockImplementation(() => true);
      await act(async () => {
        renderWithProviders(<UpdatePasswordCtrl />, { preloadedState: state });
      });
      const currentPwd = await screen.findByTestId("current-password");
      const newPwd = await screen.findByTestId("new-password");
      const confirmPwd = await screen.findByTestId("confirm-password");
      const submitBtn = await screen.findByTestId("update-pwd-submit");

      expect(submitBtn).toBeDisabled();

      await act(async () => {
        userEvent.type(currentPwd, user.password);
        userEvent.type(newPwd, "newPassword");
        userEvent.type(confirmPwd, "newPassword");
      });

      await waitFor(async () => {
        expect(submitBtn).toBeEnabled();
      });

      await act(async () => {
        userEvent.click(submitBtn);
      });

      expect(mockCompareSync).toHaveBeenCalledTimes(1);

      expect(mockShow).toHaveBeenCalledWith("Password updated successfully", {
        autoHideDuration: 5000,
        severity: "success",
      });
    });
  });
  describe("User cannot update his password", () => {
    let state: RootState;
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        user: { connectedUser: user, selectedStore: store1 },
      });
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
    });
    test("should work", async () => {
      const mockCompareSync = jest
        .spyOn(bcrypt, "compareSync")
        .mockImplementation(() => true);
      await act(async () => {
        renderWithProviders(<UpdatePasswordCtrl />, { preloadedState: state });
      });
      const currentPwd = await screen.findByTestId("current-password");
      const newPwd = await screen.findByTestId("new-password");
      const confirmPwd = await screen.findByTestId("confirm-password");
      const submitBtn = await screen.findByTestId("update-pwd-submit");

      expect(submitBtn).toBeDisabled();

      await act(async () => {
        userEvent.type(currentPwd, user.password);
        userEvent.type(newPwd, "daviddoe");
        userEvent.type(confirmPwd, "jonathandoe");
      });

      expect(submitBtn).toBeDisabled();

      expect(mockCompareSync).not.toHaveBeenCalled();

      expect(mockShow).not.toHaveBeenCalled();
    });
  });
});
