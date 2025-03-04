/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../../src/types/global.d.ts" />

import React from "react";
import { act, cleanup, screen } from "@testing-library/react";
import { useNotifications } from "@toolpad/core";
import { useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";

import { RootState } from "../../../src/services/redux/rootReducer";
import { generateFakeStore } from "../../helpers/fakers";
import { renderWithProviders } from "../../helpers/renderers";
import Settings from "../../../src/routes/Settings";
import { ROUTES } from "../../../src/constants/routes";
import { UsersSrv } from "../../../src/services/controllers/UserSrv";

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
      const mockLogout = jest
        .spyOn(UsersSrv.prototype, "logout")
        .mockImplementation(() => {});
      await act(async () => {
        renderWithProviders(<Settings />, { preloadedState: state });
      });
      const logoutBtn = await screen.findByTestId("logout-btn");

      expect(logoutBtn).toBeEnabled();

      await act(async () => {
        userEvent.click(logoutBtn);
      });

      expect(mockLogout).toHaveBeenCalledTimes(1);

      expect(mockNavigate).toHaveBeenCalledWith(`/${ROUTES.SIGNIN}`);
    });
  });
});
