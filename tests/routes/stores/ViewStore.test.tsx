/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../../src/types/global.d.ts" />

import React from "react";
import { act, screen, waitFor } from "@testing-library/react";
import { useNotifications } from "@toolpad/core";
import { useNavigate, useParams } from "react-router";

import { renderWithProviders } from "../../helpers/renderers";
import { generateFakeStore } from "../../helpers/fakers";
import { RootState } from "../../../src/services/redux/rootReducer";
import ViewStore from "../../../src/routes/stores/ViewStore";

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

describe("View Store Feature", () => {
  describe("User can see more details about a store", () => {
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
      state = generateFakeStore({
        users,
        stores,
        user: { connectedUser: user, selectedStore: null },
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
        renderWithProviders(<ViewStore />, {
          preloadedState: state,
          isProtectedRoute: true,
        });
      });
      await act(async () => {
        const name = await screen.findByTestId("store-name");
        const description = await screen.findByTestId("store-description");
        const addressLine1 = await screen.findByTestId("store-address-line1");
        const country = await screen.findByTestId("store-country");
        const state = await screen.findByTestId("store-state");
        const city = await screen.findByTestId("store-city");
        const submitBtn = screen.queryByTestId("store-submit");
        const deleteBtn = screen.queryByTestId("store-delete");

        // Disabled
        expect(name).toBeDisabled();
        expect(description).toBeDisabled();
        expect(addressLine1).toBeDisabled();
        expect(country).toBeDisabled();
        expect(state).toBeDisabled();
        expect(city).toBeDisabled();

        // Not found
        expect(submitBtn).not.toBeInTheDocument();
        expect(deleteBtn).not.toBeInTheDocument();
      });
    });
  });
  describe("User cannot see more details about a store", () => {
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
      state = generateFakeStore({
        users,
        stores,
        user: { connectedUser: null, selectedStore: null },
      });
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseParams.mockReturnValue({ storeId: store._id });
    });
    test("should redirect to NotFound", async () => {
      await act(async () => {
        renderWithProviders(<ViewStore />, {
          preloadedState: state,
          isProtectedRoute: true,
        });
      });
      let notFound: HTMLElement;
      await act(async () => {
        notFound = await screen.findByTestId("NotFound");
      });
      await waitFor(async () => {
        expect(notFound!).toBeInTheDocument();
      });
    });
  });
});
