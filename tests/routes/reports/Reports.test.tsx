/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../../src/types/global.d.ts" />

import React from "react";
import { act, cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Confirm from "material-ui-confirm";
import type { ConfirmResult } from "material-ui-confirm";
import { useNotifications } from "@toolpad/core";

import { RootState } from "../../../src/services/redux/rootReducer";
import { generateFakeStore } from "../../helpers/fakers";
import Reports from "../../../src/routes/reports/Reports";
import { renderWithProviders } from "../../helpers/renderers";

enum ORDER_STATUS {
  pending = "pending",
  completed = "completed",
}

const mockShow = jest.fn();

jest.mock("@toolpad/core", () => ({
  useNotifications: jest.fn(),
}));
const mockedUseNotifications = jest.mocked(useNotifications);
let mockedConfirm: jest.Mock;

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
describe("Reports List Feature", () => {
  afterEach(() => {
    cleanup();
  });
  describe("User can list the reports he created for the selected store", () => {
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
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<Reports />, { preloadedState: state });
      });
      const reportsList: HTMLElement =
        await screen.findByTestId("reports-list");

      await waitFor(async () => {
        expect(reportsList).toBeInTheDocument();
      });

      // Find the DataGrid container (it usually has role="grid")
      const dataGrid = screen.getByRole("grid");

      // Get all rows inside the DataGrid
      const rows = within(dataGrid).getAllByRole("row");
      const withoutHeader = rows.length - 1;
      expect(withoutHeader).toBe(2);
    });
  });
  describe("User can search for a report", () => {
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
    });
    test("should work", async () => {
      jest.useFakeTimers();
      await act(async () => {
        renderWithProviders(<Reports />, { preloadedState: state });
      });
      const reportsList: HTMLElement =
        await screen.findByTestId("reports-list");
      const searchBar: HTMLElement =
        await screen.findByTestId("reports-search");

      await waitFor(async () => {
        expect(reportsList).toBeInTheDocument();
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
  describe("User can delete a report", () => {
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
        renderWithProviders(<Reports />, {
          preloadedState: state,
          isProtectedRoute: false,
        });
      });
      const productList: HTMLElement =
        await screen.findByTestId("reports-list");

      await waitFor(async () => {
        expect(productList).toBeInTheDocument();
      });
      const actions = await screen.findByTestId(`list-actions-${report1._id}`);

      await act(async () => {
        userEvent.click(actions);
      });

      let menuList: HTMLElement = await screen.findByTestId(
        `list-actions-menu-${report1._id}`
      );

      await waitFor(async () => {
        expect(menuList!).toBeInTheDocument();
      });

      const deleteIcon = await within(menuList!).findByTestId(
        `delete-action-${report1._id}`
      );
      await act(async () => {
        userEvent.click(deleteIcon);
      });
      await waitFor(async () => {
        expect(mockedConfirm).toHaveBeenCalled();
      });
      await waitFor(async () => {
        expect(mockShow).toHaveBeenCalledWith(
          `${report1.name} has been deleted`,
          {
            severity: "success",
            autoHideDuration: 5000,
          }
        );
      });
    });
  });
  describe("User cannot list the reports he created for the selected store", () => {
    let state: RootState;
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: null, selectedStore: store },
        cart: storeCart,
        orders,
        reports,
      });
    });
    test("should redirect to NotFound", async () => {
      await act(async () => {
        renderWithProviders(<Reports />, {
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
