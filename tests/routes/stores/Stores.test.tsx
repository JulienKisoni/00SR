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
import Stores from "../../../src/routes/stores/Stores";

const mockShow = jest.fn();

jest.mock("@toolpad/core", () => ({
  useNotifications: jest.fn(),
}));
const mockedUseNotifications = jest.mocked(useNotifications);
let mockedConfirm: jest.Mock;

describe("List Stores Feature", () => {
  afterEach(() => {
    cleanup();
    jest.resetModules();
    jest.clearAllMocks();
  });
  describe("User can list the stores he created", () => {
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
      const store2: Types.IStoreDocument = {
        _id: "12345",
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
      const stores: Types.IStoreDocument[] = [store, store2];
      const connectedUser = user;
      state = generateFakeStore({
        users,
        stores,
        user: { connectedUser, selectedStore: null },
      });
    });
    test("should display two stores", async () => {
      await act(async () => {
        renderWithProviders(<Stores />, { preloadedState: state });
      });
      const storesList: HTMLElement = await screen.findByTestId("stores-list");

      await waitFor(async () => {
        expect(storesList).toBeInTheDocument();
      });

      // Find the DataGrid container (it usually has role="grid")
      const dataGrid = screen.getByRole("grid");

      // Get all rows inside the DataGrid
      const rows = within(dataGrid).getAllByRole("row");
      const withoutHeader = rows.length - 1;
      expect(withoutHeader).toBe(2);
    });
  });
  describe("User can search for a store", () => {
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
      const store2: Types.IStoreDocument = {
        _id: "12345",
        name: "My awesome store",
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
      const stores: Types.IStoreDocument[] = [store, store2];
      const connectedUser = user;
      state = generateFakeStore({
        users,
        stores,
        user: { connectedUser, selectedStore: null },
      });
    });
    test("should work", async () => {
      jest.useFakeTimers();
      await act(async () => {
        renderWithProviders(<Stores />, { preloadedState: state });
      });
      const storesList: HTMLElement = await screen.findByTestId("stores-list");
      const searchBar: HTMLElement = await screen.findByTestId("store-search");

      await waitFor(async () => {
        expect(storesList).toBeInTheDocument();
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
  describe("User can delete a store he owns", () => {
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
    const store2: Types.IStoreDocument = {
      _id: "12345",
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
    beforeEach(() => {
      jest.resetModules();
      const stores: Types.IStoreDocument[] = [store, store2];
      const connectedUser = user;
      state = generateFakeStore({
        users,
        stores,
        user: { connectedUser, selectedStore: null },
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
        renderWithProviders(<Stores />, {
          preloadedState: state,
          isProtectedRoute: false,
        });
      });
      const storesList: HTMLElement = await screen.findByTestId("stores-list");

      await waitFor(async () => {
        expect(storesList).toBeInTheDocument();
      });
      const actions = await screen.findByTestId(`list-actions-${store._id}`);

      await act(async () => {
        userEvent.click(actions);
      });

      let menuList: HTMLElement = await screen.findByTestId(
        `list-actions-menu-${store._id}`
      );

      await waitFor(async () => {
        expect(menuList!).toBeInTheDocument();
      });

      const deleteIcon = await within(menuList!).findByTestId(
        `delete-action-${store._id}`
      );
      await act(async () => {
        userEvent.click(deleteIcon);
      });
      await waitFor(async () => {
        expect(mockedConfirm).toHaveBeenCalled();
      });
      await waitFor(async () => {
        expect(mockShow).toHaveBeenCalledWith(
          `${store.name} has been deleted`,
          {
            severity: "success",
            autoHideDuration: 5000,
          }
        );
      });
    });
  });
  describe("User cannot list the stores he created", () => {
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
      const store2: Types.IStoreDocument = {
        _id: "12345",
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
      const stores: Types.IStoreDocument[] = [store, store2];
      state = generateFakeStore({
        users,
        stores,
        user: { connectedUser: null, selectedStore: null },
      });
    });
    test("should redirect to NotFound", async () => {
      await act(async () => {
        renderWithProviders(<Stores />, {
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
