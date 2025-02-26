/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../../src/types/global.d.ts" />

import React from "react";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNotifications } from "@toolpad/core";
import { useNavigate } from "react-router";

import { renderWithProviders } from "../../helpers/renderers";
import { generateFakeStore } from "../../helpers/fakers";
import { RootState } from "../../../src/services/redux/rootReducer";
import AddStore from "../../../src/routes/stores/AddStore";
import { ROUTES } from "../../../src/constants/routes";

let state: RootState;

const mockShow = jest.fn();
const mockNavigate = jest.fn();

jest.mock("@toolpad/core", () => ({
  useNotifications: jest.fn(),
}));
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: jest.fn(),
}));
jest.mock("../../../src/services/workers/wrapper.ts", () => ({
  createWorker: jest.fn(),
}));

const mockedUseNotifications = jest.mocked(useNotifications);
const mockedUseNavigate = jest.mocked(useNavigate);

describe("Add Store Feature", () => {
  describe("User can create a store by filling all the required fields", () => {
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
      const stores: Types.IStoreDocument[] = [];
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
      mockedUseNavigate.mockReturnValue(mockNavigate);
    });
    test("should work", async () => {
      await act(async () => {
        renderWithProviders(<AddStore />, { preloadedState: state });
      });
      let submitBtn: HTMLElement;
      let stateElementContainer: HTMLElement;
      await act(async () => {
        const name = await screen.findByTestId("store-name");
        const description = await screen.findByTestId("store-description");
        const addressLine1 = await screen.findByTestId("store-address-line1");
        const country = await screen.findByTestId("store-country");
        stateElementContainer = await screen.findByRole("combobox");
        const stateElement = await screen.findByTestId("store-state");
        expect(stateElement).toBeInTheDocument();
        const city = await screen.findByTestId("store-city");
        submitBtn = await screen.findByTestId("store-submit");
        expect(submitBtn).toBeDisabled();
        expect(country).toBeDisabled();

        userEvent.type(name, "My store");
        userEvent.type(description, "My store description");
        userEvent.type(addressLine1, "123 daddy street");
        userEvent.type(city, "Montreal");
        userEvent.click(stateElementContainer);
      });

      let option: HTMLElement;
      await act(async () => {
        option = await screen.findByText("Québec");
      });

      await waitFor(async () => {
        expect(option).toBeInTheDocument();
      });

      await act(async () => {
        const quebec = await screen.findByText("Québec");
        userEvent.click(quebec);
      });

      await waitFor(async () => {
        expect(submitBtn).toBeEnabled();
      });

      await act(async () => {
        userEvent.click(submitBtn);
      });

      expect(mockNavigate).toHaveBeenCalledWith(`/${ROUTES.STORES}`, {
        replace: true,
      });
      expect(mockShow).toHaveBeenCalledWith("Store created", {
        severity: "success",
        autoHideDuration: 5000,
      });
    });
  });
  describe("User cannot create a store by omitting one required field", () => {
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
      const stores: Types.IStoreDocument[] = [];
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
      mockedUseNavigate.mockReturnValue(mockNavigate);
    });
    test("should redirect to NotFound", async () => {
      await act(async () => {
        renderWithProviders(<AddStore />, { preloadedState: state });
      });
      let submitBtn: HTMLElement;
      let stateElementContainer: HTMLElement;
      await act(async () => {
        const name = await screen.findByTestId("store-name");
        const description = await screen.findByTestId("store-description");
        const addressLine1 = await screen.findByTestId("store-address-line1");
        const country = await screen.findByTestId("store-country");
        stateElementContainer = await screen.findByRole("combobox");
        const stateElement = await screen.findByTestId("store-state");
        expect(stateElement).toBeInTheDocument();
        submitBtn = await screen.findByTestId("store-submit");
        expect(country).toBeDisabled();

        userEvent.type(name, "My store");
        userEvent.type(description, "My store description");
        userEvent.type(addressLine1, "123 daddy street");
        userEvent.click(stateElementContainer);
      });
      expect(submitBtn!).toBeDisabled();
    });
  });
});
