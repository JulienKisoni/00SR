/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../../src/types/global.d.ts" />

import React from "react";
import { act, screen, waitFor, within } from "@testing-library/react";

import { renderWithProviders } from "../../helpers/renderers";
import { generateFakeStore } from "../../helpers/fakers";
import { RootState } from "../../../src/services/redux/rootReducer";
import Stores from "../../../src/routes/stores/Stores";

let state: RootState;

describe("List Stores Feature", () => {
  describe("User can list the stores he created", () => {
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
          state: "QC",
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
          state: "QC",
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
      let storesList: HTMLElement;
      await act(async () => {
        storesList = await screen.findByTestId("stores-list");
      });

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
  describe("User cannot list the stores he created", () => {
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
          state: "QC",
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
          state: "QC",
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
      let notFound: HTMLElement;
      await act(async () => {
        notFound = await screen.findByTestId("NotFound");
      });
      await waitFor(async () => {
        expect(notFound!).toBeInTheDocument();
      });
    });
  });
});
