/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../../src/types/global.d.ts" />

import React from "react";
import { act, cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNotifications } from "@toolpad/core";
import { useNavigate } from "react-router";

import { RootState } from "../../../src/services/redux/rootReducer";
import { generateFakeStore } from "../../helpers/fakers";
import { renderWithProviders } from "../../helpers/renderers";
import AddReport from "../../../src/routes/reports/AddReport";
import { ROUTES } from "../../../src/constants/routes";
import Orders from "../../../src/routes/orders/Orders";

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
}));
const mockedUseNotifications = jest.mocked(useNotifications);
const mockedUseNavigate = jest.mocked(useNavigate);
const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
const mockRemoveItem = jest.fn();
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: (...args: string[]) => mockGetItem(...args),
    setItem: (...args: string[]) => mockSetItem(...args),
    removeItem: (...args: string[]) => mockRemoveItem(...args),
  },
});

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

describe("Add Report Feature", () => {
  afterEach(() => {
    cleanup();
  });
  describe("User can create a report of maximum 4 orders", () => {
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
      mockGetItem.mockReturnValue(JSON.stringify(orders));
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<AddReport />, { preloadedState: state });
      });
      const name = await screen.findByTestId("report-name");
      const description = await screen.findByTestId("report-description");
      const submitBtn = await screen.findByTestId("report-submit");
      expect(submitBtn).toBeDisabled();
      await act(async () => {
        userEvent.type(name, "My report");
        userEvent.type(description, "My report description");
      });

      await waitFor(async () => {
        expect(submitBtn).toBeEnabled();
      });

      await act(async () => {
        userEvent.click(submitBtn);
      });

      expect(mockNavigate).toHaveBeenCalledWith(`/${ROUTES.REPORTS}`, {
        replace: true,
      });
      expect(mockShow).toHaveBeenCalledWith("Report created", {
        severity: "success",
        autoHideDuration: 5000,
      });
    });
  });
  describe("User cannot create a report by omitting one required field", () => {
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
      mockGetItem.mockReturnValue(JSON.stringify([order1]));
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
    });
    test("submit button should be disabled", async () => {
      await act(async () => {
        renderWithProviders(<AddReport />, { preloadedState: state });
      });
      const name = await screen.findByTestId("report-name");
      const submitBtn = await screen.findByTestId("report-submit");
      expect(submitBtn).toBeDisabled();
      await act(async () => {
        userEvent.type(name, "My report");
      });

      await waitFor(async () => {
        expect(submitBtn).toBeDisabled();
      });
    });
  });
  describe("User cannot create a report of more than 4 orders", () => {
    let state: RootState;
    beforeEach(() => {
      const orders: Types.IOrderDocument[] = [
        order1,
        order2,
        order3,
        order4,
        {
          ...order1,
          orderNumber: "order-number-5",
          _id: "order5",
        },
      ];
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
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<Orders />, { preloadedState: state });
      });
      const generateReport = await screen.findByTestId("generate-report");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...checkboxes] = await screen.findAllByRole("checkbox");
      await act(async () => {
        checkboxes.forEach((checkbox) => {
          userEvent.click(checkbox);
        });
      });
      await waitFor(async () => {
        expect(generateReport).toBeEnabled();
      });

      await act(async () => {
        userEvent.click(generateReport);
      });

      expect(mockShow).toHaveBeenCalledWith(
        "You can only create a report of maximum 4 orders",
        {
          severity: "warning",
          autoHideDuration: 5000,
        }
      );
    });
  });
});
