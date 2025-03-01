/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../../src/types/global.d.ts" />

import React from "react";
import { act, cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Confirm from "material-ui-confirm";
import type { ConfirmResult } from "material-ui-confirm";
import { useNotifications } from "@toolpad/core";

import { renderWithProviders } from "../../helpers/renderers";
import { generateFakeStore } from "../../helpers/fakers";
import { RootState } from "../../../src/services/redux/rootReducer";
import Products from "../../../src/routes/products/Products";

const mockShow = jest.fn();

jest.mock("@toolpad/core", () => ({
  useNotifications: jest.fn(),
}));
const mockedUseNotifications = jest.mocked(useNotifications);
let mockedConfirm: jest.Mock;

describe("List Products Feature", () => {
  afterEach(() => {
    cleanup();
    jest.resetModules();
    jest.clearAllMocks();
  });
  describe("User can list the products he created", () => {
    let state: RootState;
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
      const connectedUser = user;
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser, selectedStore: store },
      });
    });
    test("should display two products", async () => {
      await act(async () => {
        renderWithProviders(<Products />, { preloadedState: state });
      });
      const productList: HTMLElement =
        await screen.findByTestId("products-list");

      await waitFor(async () => {
        expect(productList).toBeInTheDocument();
      });

      // Find the DataGrid container (it usually has role="grid")
      const dataGrid = screen.getByRole("grid");

      // Get all rows inside the DataGrid
      const rows = within(dataGrid).getAllByRole("row");
      const withoutHeader = rows.length - 1;
      expect(withoutHeader).toBe(2);
    });
  });
  describe("User can search for a product", () => {
    let state: RootState;
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
        name: "My awesome 2",
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
      const connectedUser = user;
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser, selectedStore: store },
      });
    });
    test("should work", async () => {
      jest.useFakeTimers();
      await act(async () => {
        renderWithProviders(<Products />, { preloadedState: state });
      });
      const productList: HTMLElement =
        await screen.findByTestId("products-list");
      const searchBar: HTMLElement =
        await screen.findByTestId("product-search");

      await waitFor(async () => {
        expect(productList).toBeInTheDocument();
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
  describe("User can delete a product he owns", () => {
    let state: RootState;
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
    beforeEach(() => {
      jest.resetModules();
      const stores: Types.IStoreDocument[] = [store];
      const products: Types.IProductDocument[] = [product1, product2];
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
      const result: ConfirmResult = {
        confirmed: true,
        reason: "confirm",
      };
      mockedConfirm = jest.fn(() => Promise.resolve(result));
      jest.spyOn(Confirm, "useConfirm").mockImplementation(() => mockedConfirm);
    });
    test("should display confirm", async () => {
      await act(async () => {
        renderWithProviders(<Products />, {
          preloadedState: state,
          isProtectedRoute: false,
        });
      });
      const productList: HTMLElement =
        await screen.findByTestId("products-list");

      await waitFor(async () => {
        expect(productList).toBeInTheDocument();
      });
      const actions = await screen.findByTestId(`list-actions-${product1._id}`);

      await act(async () => {
        userEvent.click(actions);
      });

      let menuList: HTMLElement = await screen.findByTestId(
        `list-actions-menu-${product1._id}`
      );

      await waitFor(async () => {
        expect(menuList!).toBeInTheDocument();
      });

      const deleteIcon = await within(menuList!).findByTestId(
        `delete-action-${product1._id}`
      );
      await act(async () => {
        userEvent.click(deleteIcon);
      });
      await waitFor(async () => {
        expect(mockedConfirm).toHaveBeenCalled();
      });
      await waitFor(async () => {
        expect(mockShow).toHaveBeenCalledWith(
          `${product1.name} has been deleted`,
          {
            severity: "success",
            autoHideDuration: 5000,
          }
        );
      });
    });
  });
  describe("User cannot list the products he created", () => {
    let state: RootState;
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
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: null, selectedStore: store },
      });
    });
    test("should redirect to NotFound", async () => {
      await act(async () => {
        renderWithProviders(<Products />, {
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
