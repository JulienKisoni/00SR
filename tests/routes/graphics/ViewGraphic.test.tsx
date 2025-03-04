/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../../src/types/global.d.ts" />

import React from "react";
import { act, cleanup, screen, waitFor } from "@testing-library/react";
import { useNotifications } from "@toolpad/core";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import moment from "moment";

import { RootState } from "../../../src/services/redux/rootReducer";
import { generateFakeStore } from "../../helpers/fakers";
import { renderWithProviders } from "../../helpers/renderers";
import ViewGraphic from "../../../src/routes/graphics/ViewGraphic";

const mockShow = jest.fn();
const mockNavigate = jest.fn();

jest.mock("@toolpad/core", () => ({
  useNotifications: jest.fn(),
}));
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));
const mockedUseNotifications = jest.mocked(useNotifications);
const mockedUseNavigate = jest.mocked(useNavigate);
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

describe("View Graphics Details Feature", () => {
  afterEach(() => {
    cleanup();
  });
  describe("User can view more details about a graphic", () => {
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
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
      mockedUseParams.mockReturnValue({ graphicId: graphic1._id });
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<ViewGraphic />, { preloadedState: state });
      });
      const chart: HTMLElement = await screen.findByTestId("bar-chart");

      await waitFor(async () => {
        expect(chart).toBeInTheDocument();
      });
    });
  });
  describe("User cannot view more details about a report", () => {
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
      mockedUseNavigate.mockReturnValue(mockNavigate);
      mockedUseNotifications.mockReturnValue({
        show: mockShow,
        close: jest.fn(),
      });
      mockedUseParams.mockReturnValue({ graphicId: graphic1._id });
    });
    test("should redirect to NotFound", async () => {
      await act(async () => {
        renderWithProviders(<ViewGraphic />, {
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
