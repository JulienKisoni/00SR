/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../src/types/global.d.ts" />

import React from "react";
import { act, screen } from "@testing-library/react";

import AppDrawer from "../../src/components/AppDrawer";
import { renderWithProviders } from "../helpers/renderers";

describe("AppDrawer Component", () => {
  test("should render icons", async () => {
    await act(async () => {
      renderWithProviders(<AppDrawer />);
    });
    const drawerContainer = await screen.findByTestId("drawer-container");
    const storesIcon = await screen.findByTestId("stores-icon");
    const productsIcon = await screen.findByTestId("products-icon");
    const cartIcon = await screen.findByTestId("cart-icon");
    const ordersIcon = await screen.findByTestId("orders-icon");
    const reportsIcon = await screen.findByTestId("reports-icon");
    const graphicsIcon = await screen.findByTestId("graphics-icon");
    const settingsIcon = await screen.findByTestId("settings-icon");

    expect(drawerContainer).toBeInTheDocument();
    expect(storesIcon).toBeInTheDocument();
    expect(productsIcon).toBeInTheDocument();
    expect(cartIcon).toBeInTheDocument();
    expect(ordersIcon).toBeInTheDocument();
    expect(reportsIcon).toBeInTheDocument();
    expect(graphicsIcon).toBeInTheDocument();
    expect(settingsIcon).toBeInTheDocument();
  });
});
