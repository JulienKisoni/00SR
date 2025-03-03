/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../../src/types/global.d.ts" />

import React from "react";
import { act, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNotifications } from "@toolpad/core";
import Confirm from "material-ui-confirm";
import type { ConfirmResult } from "material-ui-confirm";

import { generateFakeStore } from "../../helpers/fakers";
import { renderWithProviders } from "../../helpers/renderers";
import Cart from "../../../src/routes/Cart";
import { RootState } from "../../../src/services/redux/rootReducer";
import Orders from "../../../src/routes/orders/Orders";

enum ORDER_STATUS {
  pending = "pending",
  completed = "completed",
}

const mockShow = jest.fn();

jest.mock("@toolpad/core", () => ({
  useNotifications: jest.fn(),
}));
let mockedConfirm: jest.Mock;

const mockedUseNotifications = jest.mocked(useNotifications);

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
const orders = [order1, order2];

describe("Orders Feature", () => {
  describe("User can create an order summary", () => {
    let state: RootState;
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: user, selectedStore: store },
        cart: storeCart,
      });
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<Cart />, { preloadedState: state });
      });
      const generateOrders = await screen.findByTestId("generate-orders");

      expect(generateOrders).toBeDisabled();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, checkbox1, checkbox2] = await screen.findAllByRole("checkbox");
      await act(async () => {
        userEvent.click(checkbox1);
        userEvent.click(checkbox2);
      });
      await waitFor(async () => {
        expect(generateOrders).toBeEnabled();
      });

      await act(async () => {
        userEvent.click(generateOrders);
      });

      expect(mockShow).toHaveBeenCalledWith("Order generated", {
        severity: "success",
        autoHideDuration: 5000,
      });
    });
  });
  describe("User can list all order summaries he created for the selected store", () => {
    let state: RootState;
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: user, selectedStore: store },
        cart: storeCart,
        orders,
      });
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<Orders />, { preloadedState: state });
      });
      const ordersList: HTMLElement = await screen.findByTestId("orders-list");

      await waitFor(async () => {
        expect(ordersList).toBeInTheDocument();
      });

      // Find the DataGrid container (it usually has role="grid")
      const dataGrid = screen.getByRole("grid");

      // Get all rows inside the DataGrid
      const rows = within(dataGrid).getAllByRole("row");
      const withoutHeader = rows.length - 1;
      expect(withoutHeader).toBe(2);
    });
  });
  describe("User can search for an order summary", () => {
    let state: RootState;
    const order: Types.IOrderDocument = {
      ...order2,
      orderNumber: "my-awesome-order",
    };
    const orders: Types.IOrderDocument[] = [order1, order];
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: user, selectedStore: store },
        cart: storeCart,
        orders,
      });
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
    });
    test("should work", async () => {
      jest.useFakeTimers();
      await act(async () => {
        renderWithProviders(<Orders />, { preloadedState: state });
      });
      const ordersList: HTMLElement = await screen.findByTestId("orders-list");
      const searchBar: HTMLElement = await screen.findByTestId("orders-search");

      await waitFor(async () => {
        expect(ordersList).toBeInTheDocument();
      });
      await act(async () => {
        userEvent.type(searchBar, "awesome");
        jest.advanceTimersByTime(2000);
      });

      await waitFor(async () => {
        expect(searchBar).toHaveValue("awesome");
      });
      // Find the DataGrid container (it usually has role="grid")
      const dataGrid = screen.getByRole("grid");

      // Get all rows inside the DataGrid
      const rows = within(dataGrid).getAllByRole("row");
      const withoutHeader = rows.length - 1;
      await waitFor(async () => {
        expect(withoutHeader).toBe(1);
      });
    });
  });
  describe("User can delete an order summary", () => {
    let state: RootState;
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: user, selectedStore: store },
        cart: storeCart,
        orders,
      });
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
      const result: ConfirmResult = {
        confirmed: true,
        reason: "confirm",
      };
      mockedConfirm = jest.fn(() => Promise.resolve(result));
      jest.spyOn(Confirm, "useConfirm").mockImplementation(() => mockedConfirm);
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<Orders />, {
          preloadedState: state,
          isProtectedRoute: false,
        });
      });
      const ordersList: HTMLElement = await screen.findByTestId("orders-list");

      await waitFor(async () => {
        expect(ordersList).toBeInTheDocument();
      });
      const actions = await screen.findByTestId(`list-actions-${order1._id}`);

      await act(async () => {
        userEvent.click(actions);
      });

      let menuList: HTMLElement = await screen.findByTestId(
        `list-actions-menu-${order1._id}`
      );

      await waitFor(async () => {
        expect(menuList!).toBeInTheDocument();
      });

      const deleteIcon = await within(menuList!).findByTestId(
        `delete-action-${order1._id}`
      );
      await act(async () => {
        userEvent.click(deleteIcon);
      });
      await waitFor(async () => {
        expect(mockedConfirm).toHaveBeenCalled();
      });
      await waitFor(async () => {
        expect(mockShow).toHaveBeenCalledWith(
          `${order1.orderNumber} has been deleted`,
          {
            severity: "success",
            autoHideDuration: 5000,
          }
        );
      });
    });
  });
  describe("User cannot list all order summaries he created for the selected store", () => {
    let state: RootState;
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: null, selectedStore: store },
        cart: storeCart,
        orders,
      });
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
    });
    test("should return NotFound", async () => {
      renderWithProviders(<Orders />, {
        preloadedState: state,
        isProtectedRoute: true,
      });
      const notFound: HTMLElement = await screen.findByTestId("NotFound");
      await waitFor(async () => {
        expect(notFound!).toBeInTheDocument();
      });
    });
  });
});
