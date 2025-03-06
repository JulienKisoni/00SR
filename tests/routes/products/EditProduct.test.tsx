/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../../src/types/global.d.ts" />

import React from "react";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNotifications } from "@toolpad/core";
import { useNavigate, useParams } from "react-router";
import Confirm from "material-ui-confirm";
import type { ConfirmResult } from "material-ui-confirm";

import { renderWithProviders } from "../../helpers/renderers";
import { generateFakeStore } from "../../helpers/fakers";
import { RootState } from "../../../src/services/redux/rootReducer";
import EditProduct from "../../../src/routes/products/EditProduct";
import { ROUTES } from "../../../src/constants/routes";

let state: RootState;

const mockShow = jest.fn();
const mockNavigate = jest.fn();
let mockedConfirm: jest.Mock;

jest.mock("@toolpad/core", () => ({
  useNotifications: jest.fn(),
}));
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  Navigate: () => <div />,
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));
jest.mock("../../../src/services/workers/wrapper.ts", () => ({
  createWorker: jest.fn(),
}));

const mockedUseNotifications = jest.mocked(useNotifications);
const mockedUseNavigate = jest.mocked(useNavigate);
const mockedUseParams = jest.mocked(useParams);

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
  products: ["abcd"],
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

describe("Edit Product Feature", () => {
  describe("User can update a product by filling all the required fields", () => {
    beforeEach(() => {
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
        renderWithProviders(<EditProduct />, { preloadedState: state });
      });
      const name = await screen.findByTestId("product-name");
      const description = await screen.findByTestId("product-description");
      const minQuantity = await screen.findByTestId("product-minQuantity");
      const quantity = await screen.findByTestId("product-quantity");
      const unitPrice = await screen.findByTestId("product-unitPrice");
      const submitBtn = await screen.findByTestId("product-submit");

      expect(name).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(quantity).toBeInTheDocument();
      expect(minQuantity).toBeInTheDocument();
      expect(unitPrice).toBeInTheDocument();
      expect(submitBtn).toBeDisabled();

      await act(async () => {
        userEvent.type(name, "My product updated");
        userEvent.clear(quantity);
        userEvent.type(quantity, "30");
      });

      await waitFor(async () => {
        expect(submitBtn).toBeEnabled();
      });

      await act(async () => {
        userEvent.click(submitBtn);
      });

      expect(mockShow).toHaveBeenCalledWith("Product updated", {
        severity: "success",
        autoHideDuration: 5000,
      });
    });
  });
  describe("User cannot update a product by omitting one required field", () => {
    beforeEach(() => {
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
    test("should disable submit button", async () => {
      await act(async () => {
        renderWithProviders(<EditProduct />, { preloadedState: state });
      });

      const name = await screen.findByTestId("product-name");
      const description = await screen.findByTestId("product-description");
      const minQuantity = await screen.findByTestId("product-minQuantity");
      const quantity = await screen.findByTestId("product-quantity");
      const unitPrice = await screen.findByTestId("product-unitPrice");
      const submitBtn = await screen.findByTestId("product-submit");

      expect(name).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(quantity).toBeInTheDocument();
      expect(minQuantity).toBeInTheDocument();
      expect(unitPrice).toBeInTheDocument();
      expect(submitBtn).toBeDisabled();

      await act(async () => {
        userEvent.clear(name);
      });
      expect(submitBtn!).toBeDisabled();
    });
  });
  describe("No connected user", () => {
    beforeEach(() => {
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
    test("should display not connected error message", async () => {
      await act(async () => {
        renderWithProviders(<EditProduct />, { preloadedState: state });
      });
      const name = await screen.findByTestId("product-name");
      const description = await screen.findByTestId("product-description");
      const minQuantity = await screen.findByTestId("product-minQuantity");
      const quantity = await screen.findByTestId("product-quantity");
      const unitPrice = await screen.findByTestId("product-unitPrice");
      const submitBtn = await screen.findByTestId("product-submit");

      expect(name).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(quantity).toBeInTheDocument();
      expect(minQuantity).toBeInTheDocument();
      expect(unitPrice).toBeInTheDocument();
      expect(submitBtn).toBeDisabled();

      await act(async () => {
        userEvent.type(name, "My product updated");
      });

      await waitFor(async () => {
        expect(submitBtn).toBeEnabled();
      });

      await act(async () => {
        userEvent.click(submitBtn);
      });

      expect(mockShow).toHaveBeenCalledWith("No connected user", {
        autoHideDuration: 5000,
        severity: "error",
      });
    });
  });
  describe("Remove picture", () => {
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: user, selectedStore: store },
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
        renderWithProviders(<EditProduct />, { preloadedState: state });
      });
      const name = await screen.findByTestId("product-name");
      const description = await screen.findByTestId("product-description");
      const minQuantity = await screen.findByTestId("product-minQuantity");
      const quantity = await screen.findByTestId("product-quantity");
      const unitPrice = await screen.findByTestId("product-unitPrice");
      const removePicture = await screen.findByTestId("remove-picture");
      const submitBtn = await screen.findByTestId("product-submit");

      expect(name).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(quantity).toBeInTheDocument();
      expect(minQuantity).toBeInTheDocument();
      expect(unitPrice).toBeInTheDocument();
      expect(submitBtn).toBeDisabled();

      await act(async () => {
        userEvent.type(name, "updated");
        userEvent.click(removePicture);
      });

      await waitFor(async () => {
        expect(submitBtn).toBeEnabled();
      });

      await act(async () => {
        userEvent.click(submitBtn);
      });

      expect(mockShow).toHaveBeenCalledWith("Product updated", {
        autoHideDuration: 5000,
        severity: "success",
      });
    });
  });
  describe("Not Found", () => {
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: user, selectedStore: store },
      });
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseParams.mockReturnValue({ productId: "fakeProduct" });
    });
    test("should render NotFound", async () => {
      await act(async () => {
        renderWithProviders(<EditProduct />, { preloadedState: state });
      });
      const notFound = await screen.findByTestId("NotFound");
      await waitFor(async () => {
        expect(notFound).toBeInTheDocument();
      });
    });
  });
  describe("Backdrop loading", () => {
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: user, selectedStore: null },
      });
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseParams.mockReturnValue({ productId: product._id });
    });
    test("should be displayed", async () => {
      await act(async () => {
        renderWithProviders(<EditProduct />, { preloadedState: state });
      });
      const backdrop = await screen.findByTestId("backdrop-loading");
      await waitFor(async () => {
        expect(backdrop).toBeInTheDocument();
      });
    });
  });
  describe("Deny access", () => {
    beforeEach(() => {
      const product2: Types.IProductDocument = {
        _id: "product2",
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
      state = generateFakeStore({
        users,
        stores,
        products: [product, product2],
        user: { connectedUser: user, selectedStore: store },
      });
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseParams.mockReturnValue({ productId: product2._id });
    });
    test("should be displayed", async () => {
      await act(async () => {
        renderWithProviders(<EditProduct />, { preloadedState: state });
      });
      await waitFor(async () => {
        expect(mockShow).toHaveBeenCalledWith(
          "You do not have access to this product",
          { severity: "error", autoHideDuration: 5000 }
        );
      });
    });
  });
  describe("Delete product", () => {
    beforeEach(() => {
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
      const result: ConfirmResult = {
        confirmed: true,
        reason: "confirm",
      };
      mockedConfirm = jest.fn(() => Promise.resolve(result));
      jest.spyOn(Confirm, "useConfirm").mockImplementation(() => mockedConfirm);
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<EditProduct />, { preloadedState: state });
      });
      const deleteBtn = await screen.findByTestId("product-delete");

      expect(deleteBtn).toBeInTheDocument();
      expect(deleteBtn).toBeEnabled();

      await act(async () => {
        userEvent.click(deleteBtn);
      });

      expect(mockedConfirm).toHaveBeenCalledTimes(1);
      expect(mockShow).toHaveBeenCalledWith("Product deleted", {
        severity: "success",
        autoHideDuration: 5000,
      });
      expect(mockNavigate).toHaveBeenCalledWith(`/${ROUTES.PRODUCTS}`, {
        replace: true,
      });
    });
  });
});
