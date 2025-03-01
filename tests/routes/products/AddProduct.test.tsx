/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../../src/types/global.d.ts" />

import React from "react";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNotifications } from "@toolpad/core";
import { useNavigate } from "react-router";

import { renderWithProviders } from "../../helpers/renderers";
import { generateFakeStore } from "../../helpers/fakers";
import { RootState } from "../../../src/services/redux/rootReducer";
import AddProduct from "../../../src/routes/products/AddProduct";
import { ROUTES } from "../../../src/constants/routes";

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
jest.mock("../../../src/services/workers/wrapper.ts", () => ({
  createWorker: jest.fn(),
}));

const mockedUseNotifications = jest.mocked(useNotifications);
const mockedUseNavigate = jest.mocked(useNavigate);

describe("Add Product Feature", () => {
  describe("User can create a product by filling all the required fields", () => {
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
      const users: Types.IUserDocument[] = [user];
      const stores: Types.IStoreDocument[] = [store];
      const connectedUser = user;
      state = generateFakeStore({
        users,
        stores,
        user: { connectedUser, selectedStore: store },
      });
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
      mockedUseNavigate.mockReturnValue(mockNavigate);
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<AddProduct />, { preloadedState: state });
      });
      const name = await screen.findByTestId("product-name");
      const description = await screen.findByTestId("product-description");
      const minQuantity = await screen.findByTestId("product-minQuantity");
      const quantity = await screen.findByTestId("product-quantity");
      const unitPrice = await screen.findByTestId("product-unitPrice");
      const submitBtn = await screen.findByTestId("product-submit");
      expect(submitBtn).toBeDisabled();
      await act(async () => {
        userEvent.type(name, "My product");
        userEvent.type(description, "My product description");
        userEvent.type(minQuantity, "35");
        userEvent.type(quantity, "50");
        userEvent.type(unitPrice, "200");
      });

      await waitFor(async () => {
        expect(submitBtn).toBeEnabled();
      });

      await act(async () => {
        userEvent.click(submitBtn);
      });

      expect(mockNavigate).toHaveBeenCalledWith(`/${ROUTES.PRODUCTS}`, {
        replace: true,
      });
      expect(mockShow).toHaveBeenCalledWith("Product created", {
        severity: "success",
        autoHideDuration: 5000,
      });
    });
  });
  describe("User cannot create a product by omitting one required field", () => {
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
        user: { connectedUser, selectedStore: store },
      });
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
      mockedUseNavigate.mockReturnValue(mockNavigate);
    });
    test("submit button should be disabled", async () => {
      await act(async () => {
        renderWithProviders(<AddProduct />, { preloadedState: state });
      });

      const name = await screen.findByTestId("product-name");
      const description = await screen.findByTestId("product-description");
      const minQuantity = await screen.findByTestId("product-minQuantity");
      const quantity = await screen.findByTestId("product-quantity");
      const submitBtn = await screen.findByTestId("product-submit");

      await act(async () => {
        userEvent.type(name, "My product");
        userEvent.type(description, "My product description");
        userEvent.type(minQuantity, "35");
        userEvent.type(quantity, "50");
      });

      expect(submitBtn).toBeDisabled();
    });
  });
});
