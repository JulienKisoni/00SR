/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../../src/types/global.d.ts" />

import React from "react";
import { act, cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNotifications } from "@toolpad/core";
import { useNavigate } from "react-router";
import { useParams } from "react-router";

import { RootState } from "../../../src/services/redux/rootReducer";
import { generateFakeStore } from "../../helpers/fakers";
import { renderWithProviders } from "../../helpers/renderers";
import EditReport from "../../../src/routes/reports/EditReport";

enum ORDER_STATUS {
  pending = "pending",
  completed = "completed",
}

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
const product1: Types.IProductDocument = {
  _id: "abcd",
  name: "My product 1",
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
const product2: Types.IProductDocument = {
  _id: "abcde",
  name: "My product 2",
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
const cartItems: Types.CartItem[] = [
  {
    productId: product1._id,
    quantity: 3,
    totalPrice: product1.unitPrice * 3,
    productDetails: product1,
  },
  {
    productId: product2._id,
    quantity: 4,
    totalPrice: product2.unitPrice * 4,
    productDetails: product2,
  },
];
const stores: Types.IStoreDocument[] = [store];
const products: Types.IProductDocument[] = [product1, product2];
const cart: Types.Cart = {
  storeId: store._id,
  userId: user._id,
  totalPrices: 400,
  cartId: "cartId",
  items: cartItems,
};
const storeCart = {
  [user._id]: {
    [store._id]: cart,
  },
};
const order1: Types.IOrderDocument = {
  _id: "order1",
  items: cartItems,
  owner: user._id,
  storeId: store._id,
  totalPrice: 800,
  orderNumber: "order-number-1",
  status: ORDER_STATUS.completed,
  createdAt: new Date().toISOString(),
};
const order2: Types.IOrderDocument = {
  _id: "order2",
  items: cartItems,
  owner: user._id,
  storeId: store._id,
  totalPrice: 800,
  orderNumber: "order-number-2",
  status: ORDER_STATUS.completed,
  createdAt: new Date().toISOString(),
};
const order3: Types.IOrderDocument = {
  _id: "order3",
  items: cartItems,
  owner: user._id,
  storeId: store._id,
  totalPrice: 800,
  orderNumber: "order-number-1",
  status: ORDER_STATUS.completed,
  createdAt: new Date().toISOString(),
};
const order4: Types.IOrderDocument = {
  _id: "order4",
  items: cartItems,
  owner: user._id,
  storeId: store._id,
  totalPrice: 800,
  orderNumber: "order-number-2",
  status: ORDER_STATUS.completed,
  createdAt: new Date().toISOString(),
};
const orders = [order1, order2, order3, order4];
const report1: Types.IReportDocument = {
  _id: "report1",
  name: "My report",
  description: "My description",
  owner: user._id,
  storeId: store._id,
  orders,
  createdAt: new Date().toISOString(),
};
const report2: Types.IReportDocument = {
  _id: "report2",
  name: "My awesome report",
  description: "My description",
  owner: user._id,
  storeId: store._id,
  orders,
  createdAt: new Date().toISOString(),
};
const reports = [report1, report2];

describe("Edit Report Feature", () => {
  afterEach(() => {
    cleanup();
  });
  describe("User can edit a report by filling all the required fields", () => {
    let state: RootState;
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: user, selectedStore: store },
        cart: storeCart,
        orders,
        reports,
      });
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
      mockedUseParams.mockReturnValue({ reportId: report1._id });
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<EditReport />, { preloadedState: state });
      });
      const name = await screen.findByTestId("report-name");
      const description = await screen.findByTestId("report-description");
      const submitBtn = await screen.findByTestId("report-submit");
      expect(submitBtn).toBeDisabled();
      await act(async () => {
        userEvent.type(name, "updated");
        userEvent.type(description, "updated");
      });

      await waitFor(async () => {
        expect(submitBtn).toBeEnabled();
      });

      await act(async () => {
        userEvent.click(submitBtn);
      });

      expect(mockShow).toHaveBeenCalledWith("Report updated", {
        severity: "success",
        autoHideDuration: 5000,
      });
    });
  });
  describe("User cannot edit a report by omitting one required field", () => {
    let state: RootState;
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: user, selectedStore: store },
        cart: storeCart,
        orders,
        reports,
      });
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
      mockedUseParams.mockReturnValue({ reportId: report1._id });
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<EditReport />, { preloadedState: state });
      });
      const name = await screen.findByTestId("report-name");
      const description = await screen.findByTestId("report-description");
      const submitBtn = await screen.findByTestId("report-submit");
      expect(submitBtn).toBeDisabled();
      await act(async () => {
        userEvent.type(name, "updated");
        userEvent.clear(description);
      });

      await waitFor(async () => {
        expect(submitBtn).toBeDisabled();
      });
    });
  });
});
