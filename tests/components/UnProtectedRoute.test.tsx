/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../src/types/global.d.ts" />

import React from "react";
import { act, screen, waitFor } from "@testing-library/react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  NavigateFunction,
} from "react-router";

import UnProtectedRoute from "../../src/components/UnProtectedRoute";
import { renderWithStore } from "../helpers/renderers";
import { RootState } from "../../src/services/redux/rootReducer";
import { generateFakeStore } from "../helpers/fakers";

let navigate: NavigateFunction;

const TestComponent = () => {
  navigate = useNavigate();
  return null;
};
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

describe("UnProtectedRoute Component", () => {
  test("should render children", async () => {
    await act(async () => {
      renderWithStore(
        <BrowserRouter>
          <TestComponent />
          <Routes>
            <Route
              index
              path="/home"
              element={
                <UnProtectedRoute>
                  <div data-testid="fake-children" />
                </UnProtectedRoute>
              }
            />
            <Route
              index={false}
              path="/"
              element={<div data-testid="fake-children2" />}
            />
          </Routes>
        </BrowserRouter>
      );
    });
    await act(async () => {
      navigate("/home");
    });

    const children = screen.queryByTestId("fake-children");
    const children2 = screen.queryByTestId("fake-children2");

    await waitFor(async () => {
      expect(children).toBeInTheDocument();
    });

    expect(children2).not.toBeInTheDocument();
  });
  describe("with redirection", () => {
    let state: RootState;
    beforeEach(() => {
      state = generateFakeStore({
        user: { connectedUser: user, selectedStore: null },
      });
    });
    test("should redirect", async () => {
      await act(async () => {
        renderWithStore(
          <BrowserRouter>
            <TestComponent />
            <Routes>
              <Route
                index
                path="/home"
                element={
                  <UnProtectedRoute>
                    <div data-testid="fake-children" />
                  </UnProtectedRoute>
                }
              />
              <Route
                index={false}
                path="/"
                element={<div data-testid="fake-children2" />}
              />
            </Routes>
          </BrowserRouter>,
          { preloadedState: state }
        );
      });
      await act(async () => {
        navigate("/home");
      });
      const children = screen.queryByTestId("fake-children");
      const children2 = screen.queryByTestId("fake-children2");

      expect(children2).toBeInTheDocument();

      expect(children).not.toBeInTheDocument();
    });
  });
});
