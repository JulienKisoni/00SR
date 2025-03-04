/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../../src/types/global.d.ts" />

import React from "react";
import { act, cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNotifications } from "@toolpad/core";
import { useNavigate } from "react-router";
import moment from "moment";

import { RootState } from "../../../src/services/redux/rootReducer";
import { generateFakeStore } from "../../helpers/fakers";
import { renderWithProviders } from "../../helpers/renderers";
import { ROUTES } from "../../../src/constants/routes";
import AddGraphic from "../../../src/routes/graphics/AddGraphic";
import Products from "../../../src/routes/products/Products";

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

describe("Add Graphic Feature", () => {
  afterEach(() => {
    cleanup();
  });
  describe("User can create a graphic of maximum 3 products", () => {
    let state: RootState;
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: user, selectedStore: store },
        histories,
      });
      mockGetItem.mockReturnValue(
        JSON.stringify([product1, product2, product3])
      );
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<AddGraphic />, { preloadedState: state });
      });
      const name = await screen.findByTestId("graphic-name");
      const description = await screen.findByTestId("graphic-description");
      const submitBtn = await screen.findByTestId("graphic-submit");
      expect(submitBtn).toBeDisabled();
      await act(async () => {
        userEvent.type(name, "My graphic");
        userEvent.type(description, "My graphic description");
      });

      await waitFor(async () => {
        expect(submitBtn).toBeEnabled();
      });

      await act(async () => {
        userEvent.click(submitBtn);
      });

      expect(mockNavigate).toHaveBeenCalledWith(`/${ROUTES.GRAPHICS}`, {
        replace: true,
      });
      expect(mockShow).toHaveBeenCalledWith("Graphic created", {
        severity: "success",
        autoHideDuration: 5000,
      });
    });
  });
  describe("User cannot create a graphic by omitting one required field", () => {
    let state: RootState;
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: user, selectedStore: store },
        histories,
      });
      mockGetItem.mockReturnValue(JSON.stringify([product1]));
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
    });
    test("submit button should be disabled", async () => {
      await act(async () => {
        renderWithProviders(<AddGraphic />, { preloadedState: state });
      });
      const name = await screen.findByTestId("graphic-name");
      const submitBtn = await screen.findByTestId("graphic-submit");
      expect(submitBtn).toBeDisabled();
      await act(async () => {
        userEvent.type(name, "My graphic");
      });

      await waitFor(async () => {
        expect(submitBtn).toBeDisabled();
      });
    });
  });
  describe("User cannot create a graphic of more than 3 products", () => {
    let state: RootState;
    beforeEach(() => {
      state = generateFakeStore({
        users,
        stores,
        products,
        user: { connectedUser: user, selectedStore: store },
        histories,
      });
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<Products />, { preloadedState: state });
      });
      const generateGraphic = await screen.findByTestId("generate-graphic-btn");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...checkboxes] = await screen.findAllByRole("checkbox");
      await act(async () => {
        checkboxes.forEach((checkbox) => {
          userEvent.click(checkbox);
        });
      });
      await waitFor(async () => {
        expect(generateGraphic).toBeEnabled();
      });

      await act(async () => {
        userEvent.click(generateGraphic);
      });

      expect(mockShow).toHaveBeenCalledWith(
        "You can only create a graphic of maximum 3 products",
        {
          severity: "warning",
          autoHideDuration: 5000,
        }
      );
    });
  });
});
