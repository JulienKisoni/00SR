/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../../src/types/global.d.ts" />

import React from "react";
import { act, cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Confirm from "material-ui-confirm";
import type { ConfirmResult } from "material-ui-confirm";
import { useNotifications } from "@toolpad/core";
import moment from "moment";

import { RootState } from "../../../src/services/redux/rootReducer";
import { generateFakeStore } from "../../helpers/fakers";
import { renderWithProviders } from "../../helpers/renderers";
import Graphics from "../../../src/routes/graphics/Graphics";

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
const product3: Types.IProductDocument = {
  _id: "product3",
  name: "My product 3",
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
const product4: Types.IProductDocument = {
  _id: "product4",
  name: "My product 4",
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
const products: Types.IProductDocument[] = [
  product1,
  product2,
  product3,
  product4,
];
const date = moment();
const evolutions: Types.IEvolution[] = [
  {
    date: date.subtract(1, "days").toISOString(),
    dateKey: "dateKey1",
    quantity: 50,
  },
  {
    date: new Date().toISOString(),
    dateKey: "dateKey1",
    quantity: 50,
  },
];
const history1: Types.IHistoryDocument = {
  productId: product1._id,
  productName: product1.name,
  evolutions,
  storeId: store._id,
  createdAt: new Date().toISOString(),
};
const history2: Types.IHistoryDocument = {
  productId: product2._id,
  productName: product2.name,
  evolutions,
  storeId: store._id,
  createdAt: new Date().toISOString(),
};
const history3: Types.IHistoryDocument = {
  productId: product3._id,
  productName: product3.name,
  evolutions,
  storeId: store._id,
  createdAt: new Date().toISOString(),
};
const histories = [history1, history2, history3];
const graphic1: Types.IGraphicDocument = {
  _id: "graphic1",
  name: "Graphic 1",
  description: "My graphic description",
  owner: user._id,
  storeId: store._id,
  ownerDetails: user,
  products: histories,
  createdAt: new Date().toISOString(),
};
const graphic2: Types.IGraphicDocument = {
  _id: "graphic2",
  name: "Graphic 2 awesome",
  description: "My graphic description",
  owner: user._id,
  storeId: store._id,
  ownerDetails: user,
  products: histories,
  createdAt: new Date().toISOString(),
};
const graphics = [graphic1, graphic2];
describe("Graphics List Feature", () => {
  afterEach(() => {
    cleanup();
  });
  describe("User can list the Graphics he created for the selected store", () => {
    let state: RootState;
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: user, selectedStore: store },
        histories,
        graphics,
      });
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<Graphics />, { preloadedState: state });
      });
      const reportsList: HTMLElement =
        await screen.findByTestId("graphics-list");

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
  describe("User can search for a graphic", () => {
    let state: RootState;
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: user, selectedStore: store },
        histories,
        graphics,
      });
    });
    test("should work", async () => {
      jest.useFakeTimers();
      await act(async () => {
        renderWithProviders(<Graphics />, { preloadedState: state });
      });
      const reportsList: HTMLElement =
        await screen.findByTestId("graphics-list");
      const searchBar: HTMLElement =
        await screen.findByTestId("graphics-search");

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
  describe("User can delete a graphic", () => {
    let state: RootState;
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: user, selectedStore: store },
        histories,
        graphics,
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
        renderWithProviders(<Graphics />, {
          preloadedState: state,
          isProtectedRoute: false,
        });
      });
      const graphicList: HTMLElement =
        await screen.findByTestId("graphics-list");

      await waitFor(async () => {
        expect(graphicList).toBeInTheDocument();
      });
      const actions = await screen.findByTestId(`list-actions-${graphic1._id}`);

      await act(async () => {
        userEvent.click(actions);
      });

      let menuList: HTMLElement = await screen.findByTestId(
        `list-actions-menu-${graphic1._id}`
      );

      await waitFor(async () => {
        expect(menuList!).toBeInTheDocument();
      });

      const deleteIcon = await within(menuList!).findByTestId(
        `delete-action-${graphic1._id}`
      );
      await act(async () => {
        userEvent.click(deleteIcon);
      });
      await waitFor(async () => {
        expect(mockedConfirm).toHaveBeenCalled();
      });
      await waitFor(async () => {
        expect(mockShow).toHaveBeenCalledWith(
          `${graphic1.name} has been deleted`,
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
        histories,
        graphics,
      });
    });
    test("should redirect to NotFound", async () => {
      await act(async () => {
        renderWithProviders(<Graphics />, {
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
