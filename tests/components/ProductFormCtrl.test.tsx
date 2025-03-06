/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../src/types/global.d.ts" />

import { act, cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNotifications } from "@toolpad/core";
import { useNavigate } from "react-router";

import { renderWithProviders } from "../helpers/renderers";
import { RootState } from "../../src/services/redux/rootReducer";
import { generateFakeStore } from "../helpers/fakers";
import ProductFormCtlr from "../../src/components/controllers/forms/ProductFormCtrl";
import { ProductSrv } from "../../src/services/controllers/ProductSrv";
import { GenericError } from "../../src/classes/GenericError";

const mockShow = jest.fn();
const mockNavigate = jest.fn();

jest.mock("../../src/services/workers/wrapper.ts", () => ({
  createWorker: jest.fn(),
}));
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
const stores: Types.IStoreDocument[] = [store];
describe("ProductFormCtrl", () => {
  let state: RootState;
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
    jest.resetModules();
  });
  test("should fail to submit due to error", async () => {
    state = generateFakeStore({
      users,
      stores,
      user: { connectedUser: user, selectedStore: store },
    });
    mockedUseNavigate.mockReturnValue(mockNavigate);
    mockedUseNotifications.mockReturnValue({
      show: mockShow,
      close: jest.fn(),
    });
    jest.spyOn(ProductSrv.prototype, "addOne").mockImplementation(() => {
      const error = new GenericError("Something went wrong");
      return { error };
    });
    await act(async () => {
      renderWithProviders(
        <ProductFormCtlr
          mode="add"
          initialValues={{
            name: "",
            description: "",
            minQuantity: undefined,
            quantity: undefined,
            unitPrice: undefined,
          }}
          onDeleteProduct={() => {}}
          productId=""
          defaultImgSrc=""
        />,
        { preloadedState: state }
      );
    });
    const name = await screen.findByTestId("product-name");
    const description = await screen.findByTestId("product-description");
    const minQuantity = await screen.findByTestId("product-minQuantity");
    const quantity = await screen.findByTestId("product-quantity");
    const unitPrice = await screen.findByTestId("product-unitPrice");
    const submitBtn = await screen.findByTestId("product-submit");
    expect(submitBtn).toBeDisabled();
    await act(async () => {
      userEvent.type(name, "My product");
      userEvent.type(description, "My product description");
      userEvent.type(minQuantity, "35");
      userEvent.type(quantity, "50");
      userEvent.type(unitPrice, "200");
    });

    await waitFor(async () => {
      expect(submitBtn).toBeEnabled();
    });

    await act(async () => {
      userEvent.click(submitBtn);
    });

    expect(mockShow).toHaveBeenCalledWith("Something went wrong", {
      autoHideDuration: 5000,
      severity: "error",
    });
  });
  test("should fail to submit with no selected store", async () => {
    state = generateFakeStore({
      users,
      stores,
      user: { connectedUser: user, selectedStore: null },
    });
    mockedUseNavigate.mockReturnValue(mockNavigate);
    mockedUseNotifications.mockReturnValue({
      show: mockShow,
      close: jest.fn(),
    });
    await act(async () => {
      renderWithProviders(
        <ProductFormCtlr
          mode="edit"
          initialValues={{
            name: "name",
            description: "my description",
            minQuantity: 5,
            quantity: 10,
            unitPrice: 100,
          }}
          onDeleteProduct={() => {}}
          productId="productId"
          defaultImgSrc=""
        />,
        { preloadedState: state }
      );
    });
    const name = await screen.findByTestId("product-name");
    const description = await screen.findByTestId("product-description");
    const submitBtn = await screen.findByTestId("product-submit");
    expect(submitBtn).toBeDisabled();
    await act(async () => {
      userEvent.type(name, "updated");
      userEvent.type(description, "updated");
    });

    await waitFor(async () => {
      expect(submitBtn).toBeEnabled();
    });

    await act(async () => {
      userEvent.click(submitBtn);
    });

    expect(mockShow).toHaveBeenCalledWith("No selected store", {
      autoHideDuration: 5000,
      severity: "error",
    });
  });
});
