/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../../src/types/global.d.ts" />

import React from "react";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNotifications } from "@toolpad/core";
import { useNavigate, useParams } from "react-router";

import { renderWithProviders } from "../../helpers/renderers";
import { generateFakeStore } from "../../helpers/fakers";
import { RootState } from "../../../src/services/redux/rootReducer";
import EditStore from "../../../src/routes/stores/EditStore";

let state: RootState;

const mockShow = jest.fn();
const mockNavigate = jest.fn();

jest.mock("@toolpad/core", () => ({
  useNotifications: jest.fn(),
}));
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));
jest.mock("../../../src/services/workers/wrapper.ts", () => ({
  createWorker: jest.fn(),
}));

const mockedUseNotifications = jest.mocked(useNotifications);
const mockedUseNavigate = jest.mocked(useNavigate);
const mockedUseParams = jest.mocked(useParams);

describe("Add Store Feature", () => {
  describe("User can update a store by filling all the required fields", () => {
    beforeEach(() => {
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
      const store: Types.IStoreDocument = {
        _id: "1234",
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
      const stores: Types.IStoreDocument[] = [store];
      const connectedUser = user;
      state = generateFakeStore({
        users,
        stores,
        user: { connectedUser, selectedStore: null },
      });
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseParams.mockReturnValue({ storeId: store._id });
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<EditStore />, { preloadedState: state });
      });
      let submitBtn: HTMLElement;
      await act(async () => {
        const name = await screen.findByTestId("store-name");
        const description = await screen.findByTestId("store-description");
        const addressLine1 = await screen.findByTestId("store-address-line1");
        const country = await screen.findByTestId("store-country");
        const stateElement = await screen.findByTestId("store-state");
        const city = await screen.findByTestId("store-city");
        expect(stateElement).toBeInTheDocument();
        expect(description).toBeInTheDocument();
        expect(addressLine1).toBeInTheDocument();
        expect(city).toBeInTheDocument();
        submitBtn = await screen.findByTestId("store-submit");
        expect(submitBtn).toBeDisabled();
        expect(country).toBeDisabled();

        userEvent.type(name, " updated");
      });

      await waitFor(async () => {
        expect(submitBtn).toBeEnabled();
      });

      await act(async () => {
        userEvent.click(submitBtn);
      });

      expect(mockShow).toHaveBeenCalledWith("Store updated", {
        severity: "success",
        autoHideDuration: 5000,
      });
    });
  });
  describe("User cannot update a store by omitting one required field", () => {
    beforeEach(() => {
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
      const store: Types.IStoreDocument = {
        _id: "1234",
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
      const stores: Types.IStoreDocument[] = [store];
      const connectedUser = user;
      state = generateFakeStore({
        users,
        stores,
        user: { connectedUser, selectedStore: null },
      });
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseParams.mockReturnValue({ storeId: store._id });
    });
    test("should disable submit button", async () => {
      await act(async () => {
        renderWithProviders(<EditStore />, { preloadedState: state });
      });
      let submitBtn: HTMLElement;
      await act(async () => {
        const name = await screen.findByTestId("store-name");
        const description = await screen.findByTestId("store-description");
        const addressLine1 = await screen.findByTestId("store-address-line1");
        const country = await screen.findByTestId("store-country");
        const stateElement = await screen.findByTestId("store-state");
        const city = await screen.findByTestId("store-city");
        expect(stateElement).toBeInTheDocument();
        expect(description).toBeInTheDocument();
        expect(addressLine1).toBeInTheDocument();
        expect(city).toBeInTheDocument();
        submitBtn = await screen.findByTestId("store-submit");
        expect(country).toBeDisabled();

        userEvent.clear(name);
      });
      expect(submitBtn!).toBeDisabled();
    });
  });
});
