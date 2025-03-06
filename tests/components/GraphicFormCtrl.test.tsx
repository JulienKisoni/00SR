/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../src/types/global.d.ts" />

import { act, cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNotifications } from "@toolpad/core";
import { useNavigate } from "react-router";

import { renderWithProviders } from "../helpers/renderers";
import { RootState } from "../../src/services/redux/rootReducer";
import { generateFakeStore } from "../helpers/fakers";
import GraphicFormCtrl from "../../src/components/controllers/forms/GraphicFormCtrl";

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
describe("GraphicFormCtrl", () => {
  let state: RootState;
  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
    jest.resetModules();
  });
  test("should fail to submit with no connected user", async () => {
    state = generateFakeStore({
      users,
      stores,
      user: { connectedUser: null, selectedStore: store },
    });
    mockedUseNavigate.mockReturnValue(mockNavigate);
    mockedUseNotifications.mockReturnValue({
      show: mockShow,
      close: jest.fn(),
    });
    await act(async () => {
      renderWithProviders(
        <GraphicFormCtrl
          mode="edit"
          initialValues={{ name: "name", description: "my description" }}
          onDeleteGraphic={() => {}}
          graphicId="graphicId"
          createdAt={new Date().toISOString()}
          products={[]}
        />,
        { preloadedState: state }
      );
    });
    const name = await screen.findByTestId("graphic-name");
    const description = await screen.findByTestId("graphic-description");
    const submitBtn = await screen.findByTestId("graphic-submit");
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

    expect(mockShow).toHaveBeenCalledWith("No connected user", {
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
        <GraphicFormCtrl
          mode="edit"
          initialValues={{ name: "name", description: "my description" }}
          onDeleteGraphic={() => {}}
          graphicId="graphicId"
          createdAt={new Date().toISOString()}
          products={[]}
        />,
        { preloadedState: state }
      );
    });
    const name = await screen.findByTestId("graphic-name");
    const description = await screen.findByTestId("graphic-description");
    const submitBtn = await screen.findByTestId("graphic-submit");
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
