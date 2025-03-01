/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../../src/types/global.d.ts" />

import React from "react";
import { act, screen, waitFor } from "@testing-library/react";
import { useNotifications } from "@toolpad/core";
import { useNavigate, useParams } from "react-router";

import { renderWithProviders } from "../../helpers/renderers";
import { generateFakeStore } from "../../helpers/fakers";
import { RootState } from "../../../src/services/redux/rootReducer";
import ViewProduct from "../../../src/routes/products/ViewProduct";

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

describe("View Product Feature", () => {
  describe("User can see more details about a product", () => {
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
      const product: Types.IProductDocument = {
        _id: "abcd",
        name: "My product",
        description: "My product description",
        storeId: store._id,
        key: "KEY",
        quantity: 10,
        minQuantity: 5,
        unitPrice: 200,
        owner: user._id,
        reviews: [],
        picture: "picture_uri",
        createdAt: new Date().toISOString(),
        active: true,
      };
      const stores: Types.IStoreDocument[] = [store];
      const products: Types.IProductDocument[] = [product];
      const connectedUser = user;
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser, selectedStore: store },
      });
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseParams.mockReturnValue({ productId: product._id });
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<ViewProduct />, {
          preloadedState: state,
          isProtectedRoute: true,
        });
      });
      const name = await screen.findByTestId("product-name");
      const description = await screen.findByTestId("product-description");
      const minQuantity = await screen.findByTestId("product-minQuantity");
      const quantity = await screen.findByTestId("product-quantity");
      const unitPrice = await screen.findByTestId("product-unitPrice");
      const submitBtn = screen.queryByTestId("product-submit");
      const deleteBtn = screen.queryByTestId("product-delete");

      // Disabled
      expect(name).toBeDisabled();
      expect(description).toBeDisabled();
      expect(minQuantity).toBeDisabled();
      expect(quantity).toBeDisabled();
      expect(unitPrice).toBeDisabled();

      // Not found
      expect(submitBtn).not.toBeInTheDocument();
      expect(deleteBtn).not.toBeInTheDocument();
    });
  });
  describe("User cannot see more details about a product", () => {
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
      const product: Types.IProductDocument = {
        _id: "abcd",
        name: "My product",
        description: "My product description",
        storeId: store._id,
        key: "KEY",
        quantity: 10,
        minQuantity: 5,
        unitPrice: 200,
        owner: user._id,
        reviews: [],
        picture: "picture_uri",
        createdAt: new Date().toISOString(),
        active: true,
      };
      const stores: Types.IStoreDocument[] = [store];
      const products: Types.IProductDocument[] = [product];
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: null, selectedStore: store },
      });
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseParams.mockReturnValue({ productId: product._id });
    });
    test("should redirect to NotFound", async () => {
      await act(async () => {
        renderWithProviders(<ViewProduct />, {
          preloadedState: state,
          isProtectedRoute: true,
        });
      });
      let notFound: HTMLElement = await screen.findByTestId("NotFound");
      await waitFor(async () => {
        expect(notFound!).toBeInTheDocument();
      });
    });
  });
});
