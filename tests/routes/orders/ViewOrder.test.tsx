/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../../src/types/global.d.ts" />

import React from "react";
import { act, screen, waitFor, within } from "@testing-library/react";
import { useParams } from "react-router";

import ViewOrder from "../../../src/routes/orders/ViewOrder";
import { RootState } from "../../../src/services/redux/rootReducer";
import { generateFakeStore } from "../../helpers/fakers";
import { renderWithProviders } from "../../helpers/renderers";

enum ORDER_STATUS {
  pending = "pending",
  completed = "completed",
}

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));
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
const orders = [order1, order2];

describe("View Order Details", () => {
  describe("User can see details about an order summary", () => {
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
      mockedUseParams.mockReturnValue({ orderId: order1._id });
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<ViewOrder />, { preloadedState: state });
      });
      const orderDetailsList: HTMLElement =
        await screen.findByTestId("order-details-list");

      await waitFor(async () => {
        expect(orderDetailsList).toBeInTheDocument();
      });

      // Find the DataGrid container (it usually has role="grid")
      const dataGrid = screen.getByRole("grid");

      // Get all rows inside the DataGrid
      const rows = within(dataGrid).getAllByRole("row");
      const withoutHeader = rows.length - 1;
      expect(withoutHeader).toBe(2);
    });
  });
  describe("User cannot see details about an order summary", () => {
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
      mockedUseParams.mockReturnValue({ orderId: order1._id });
    });
    test("should return NotFound", async () => {
      await act(async () => {
        renderWithProviders(<ViewOrder />, {
          preloadedState: state,
          isProtectedRoute: true,
        });
      });
      const notFound: HTMLElement = await screen.findByTestId("NotFound");
      await waitFor(async () => {
        expect(notFound!).toBeInTheDocument();
      });
    });
  });
});
