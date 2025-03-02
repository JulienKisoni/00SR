/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../src/types/global.d.ts" />

import React from "react";
import { act, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNotifications } from "@toolpad/core";
import Confirm from "material-ui-confirm";
import type { ConfirmResult } from "material-ui-confirm";

import { RootState } from "../../src/services/redux/rootReducer";
import { generateFakeStore } from "../helpers/fakers";
import Products from "../../src/routes/products/Products";
import { renderWithProviders } from "../helpers/renderers";
import Cart from "../../src/routes/Cart";

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
const stores: Types.IStoreDocument[] = [store];
const products: Types.IProductDocument[] = [product1, product2];

describe("Cart Feature", () => {
  describe("User can add products to his cart", () => {
    let state: RootState;
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
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<Products />, {
          preloadedState: state,
          isProtectedRoute: false,
        });
      });
      const addToCart = await screen.findByTestId("add-to-cart-btn");
      expect(addToCart).toBeDisabled();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, checkbox1, checkbox2] = await screen.findAllByRole("checkbox");
      await act(async () => {
        userEvent.click(checkbox1);
        userEvent.click(checkbox2);
      });
      await waitFor(async () => {
        expect(addToCart).toBeEnabled();
      });

      await act(async () => {
        userEvent.click(addToCart);
      });

      expect(mockShow).toHaveBeenCalledWith("Cart updated", {
        severity: "success",
        autoHideDuration: 5000,
      });
    });
  });
  describe("User cannot add product to his cart", () => {
    let state: RootState;
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
    });
    test("add to cart button should be disabled", async () => {
      await act(async () => {
        renderWithProviders(<Products />, {
          preloadedState: state,
          isProtectedRoute: false,
        });
      });
      const addToCart = await screen.findByTestId("add-to-cart-btn");
      expect(addToCart).toBeDisabled();
    });
  });
  describe("User can list all items inside the cart", () => {
    let state: RootState;
    beforeEach(() => {
      const cartItems: Types.CartItem[] = [
        {
          productId: product1._id,
          quantity: 3,
          totalPrice: product1.unitPrice * 3,
        },
        {
          productId: product2._id,
          quantity: 4,
          totalPrice: product2.unitPrice * 4,
        },
      ];
      const cart: Types.Cart = {
        storeId: store._id,
        userId: user._id,
        totalPrices: 400,
        cartId: "cartId",
        items: cartItems,
      };
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: user, selectedStore: store },
        cart: {
          [user._id]: {
            [store._id]: cart,
          },
        },
      });
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<Cart />, {
          preloadedState: state,
          isProtectedRoute: false,
        });
      });
      const cartItemsList: HTMLElement =
        await screen.findByTestId("cartItems-list");

      await waitFor(async () => {
        expect(cartItemsList).toBeInTheDocument();
      });

      // Find the DataGrid container (it usually has role="grid")
      const dataGrid = screen.getByRole("grid");

      // Get all rows inside the DataGrid
      const rows = within(dataGrid).getAllByRole("row");
      const withoutHeader = rows.length - 1;
      expect(withoutHeader).toBe(2);
    });
  });
  describe("User can remove an item from the cart", () => {
    let state: RootState;
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
    const cart: Types.Cart = {
      storeId: store._id,
      userId: user._id,
      totalPrices: 400,
      cartId: "cartId",
      items: cartItems,
    };
    state = generateFakeStore({
      users,
      stores,
      products,
      user: { connectedUser: user, selectedStore: store },
      cart: {
        [user._id]: {
          [store._id]: cart,
        },
      },
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
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<Cart />, {
          preloadedState: state,
          isProtectedRoute: true,
        });
      });
      const deleteItems = await screen.findByTestId("delete-items");
      expect(deleteItems).toBeDisabled();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, checkbox1, checkbox2] = await screen.findAllByRole("checkbox");
      await act(async () => {
        userEvent.click(checkbox1);
        userEvent.click(checkbox2);
      });
      await waitFor(async () => {
        expect(deleteItems).toBeEnabled();
      });

      await act(async () => {
        userEvent.click(deleteItems);
      });

      expect(mockedConfirm).toHaveBeenCalled();
      expect(mockShow).toHaveBeenCalledWith("Item(s) removed successfully", {
        severity: "success",
        autoHideDuration: 5000,
      });
    });
  });
  describe("User can search for a product inside the cart", () => {
    let state: RootState;
    beforeEach(() => {
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
          productDetails: {
            ...product2,
            name: "My awesome product",
          },
        },
      ];
      const cart: Types.Cart = {
        storeId: store._id,
        userId: user._id,
        totalPrices: 400,
        cartId: "cartId",
        items: cartItems,
      };
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: user, selectedStore: store },
        cart: {
          [user._id]: {
            [store._id]: cart,
          },
        },
      });
    });
    test("should work", async () => {
      jest.useFakeTimers();
      await act(async () => {
        renderWithProviders(<Cart />, { preloadedState: state });
      });
      const cartItemsList: HTMLElement =
        await screen.findByTestId("cartItems-list");
      const searchBar: HTMLElement = await screen.findByTestId("cart-search");

      await waitFor(async () => {
        expect(cartItemsList).toBeInTheDocument();
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
  describe("User can update buy quantity of a cart item", () => {
    let state: RootState;
    beforeEach(() => {
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
      const cart: Types.Cart = {
        storeId: store._id,
        userId: user._id,
        totalPrices: 400,
        cartId: "cartId",
        items: cartItems,
      };
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: user, selectedStore: store },
        cart: {
          [user._id]: {
            [store._id]: cart,
          },
        },
      });
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
    });
    test("should work", async () => {
      jest.useFakeTimers();
      await act(async () => {
        renderWithProviders(<Cart />, { preloadedState: state });
      });
      const buyQty = await screen.findByTestId(`buy-quantity-${product1._id}`);
      await act(async () => {
        userEvent.type(buyQty, "10");
        jest.advanceTimersByTime(1500);
      });
      expect(mockShow).toHaveBeenCalledWith(
        `${product1.name} updated inside the cart`,
        { severity: "success", autoHideDuration: 5000 }
      );
    });
  });
  describe("User cannot update buy quantity of a cart item", () => {
    let state: RootState;
    beforeEach(() => {
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
      const cart: Types.Cart = {
        storeId: store._id,
        userId: user._id,
        totalPrices: 400,
        cartId: "cartId",
        items: cartItems,
      };
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: user, selectedStore: store },
        cart: {
          [user._id]: {
            [store._id]: cart,
          },
        },
      });
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
    });
    test("should work", async () => {
      jest.useFakeTimers();
      await act(async () => {
        renderWithProviders(<Cart />, { preloadedState: state });
      });
      const buyQty = await screen.findByTestId(`buy-quantity-${product1._id}`);
      await act(async () => {
        userEvent.type(buyQty, "-10");
        jest.advanceTimersByTime(1500);
      });
      expect(mockShow).toHaveBeenCalledWith("Invalid value", {
        severity: "success",
        autoHideDuration: 5000,
      });
    });
  });
  describe("User cannot list items inside the cart", () => {
    let state: RootState;
    beforeEach(() => {
      const cartItems: Types.CartItem[] = [
        {
          productId: product1._id,
          quantity: 3,
          totalPrice: product1.unitPrice * 3,
        },
        {
          productId: product2._id,
          quantity: 4,
          totalPrice: product2.unitPrice * 4,
        },
      ];
      const cart: Types.Cart = {
        storeId: store._id,
        userId: user._id,
        totalPrices: 400,
        cartId: "cartId",
        items: cartItems,
      };
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: null, selectedStore: store },
        cart: {
          [user._id]: {
            [store._id]: cart,
          },
        },
      });
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
    });
    test("should redirect to NotFound", async () => {
      await act(async () => {
        renderWithProviders(<Cart />, {
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
