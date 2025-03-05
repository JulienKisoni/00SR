/* eslint-disable testing-library/no-unnecessary-act */
/// <reference path="../../../src/types/global.d.ts" />

import React from "react";
import { act, cleanup, screen, waitFor, within } from "@testing-library/react";
import { useParams } from "react-router";
import { usePDF } from "react-to-pdf";

import { RootState } from "../../../src/services/redux/rootReducer";
import { generateFakeStore } from "../../helpers/fakers";
import { renderWithProviders } from "../../helpers/renderers";
import DownloadReport from "../../../src/routes/reports/DownloadReport";

enum ORDER_STATUS {
  pending = "pending",
  completed = "completed",
}

const mockToPDF = jest.fn();

jest.mock("react-to-pdf", () => ({
  Resolution: {
    LOW: 1,
    NORMAL: 2,
    MEDIUM: 3,
    HIGH: 7,
    EXTREME: 12,
  },
  Margin: {
    NONE: 0,
    SMALL: 5,
    MEDIUM: 10,
    LARGE: 25,
  },
  usePDF: jest.fn(),
}));
jest.mock("@toolpad/core", () => ({
  useNotifications: jest.fn(),
}));
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

const mockedUseParams = jest.mocked(useParams);
const mockUsePDF = jest.mocked(usePDF);

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
const cartItems: Types.CartItem[] = [
  {
    productId: product1._id,
    quantity: 3,
    totalPrice: product1.unitPrice * 3,
    productDetails: product1,
  },
  {
    productId: product2._id,
    quantity: 4,
    totalPrice: product2.unitPrice * 4,
    productDetails: product2,
  },
];
const stores: Types.IStoreDocument[] = [store];
const products: Types.IProductDocument[] = [product1, product2];
const cart: Types.Cart = {
  storeId: store._id,
  userId: user._id,
  totalPrices: 400,
  cartId: "cartId",
  items: cartItems,
};
const storeCart = {
  [user._id]: {
    [store._id]: cart,
  },
};
const order1: Types.IOrderDocument = {
  _id: "order1",
  items: cartItems,
  owner: user._id,
  storeId: store._id,
  totalPrice: 800,
  orderNumber: "order-number-1",
  status: ORDER_STATUS.completed,
  createdAt: new Date().toISOString(),
};
const order2: Types.IOrderDocument = {
  _id: "order2",
  items: cartItems,
  owner: user._id,
  storeId: store._id,
  totalPrice: 800,
  orderNumber: "order-number-2",
  status: ORDER_STATUS.completed,
  createdAt: new Date().toISOString(),
};
const order3: Types.IOrderDocument = {
  _id: "order3",
  items: cartItems,
  owner: user._id,
  storeId: store._id,
  totalPrice: 800,
  orderNumber: "order-number-1",
  status: ORDER_STATUS.completed,
  createdAt: new Date().toISOString(),
};
const order4: Types.IOrderDocument = {
  _id: "order4",
  items: cartItems,
  owner: user._id,
  storeId: store._id,
  totalPrice: 800,
  orderNumber: "order-number-2",
  status: ORDER_STATUS.completed,
  createdAt: new Date().toISOString(),
};
const orders = [order1, order2, order3, order4];
const report1: Types.IReportDocument = {
  _id: "report1",
  name: "My report",
  description: "My description",
  owner: user._id,
  storeId: store._id,
  orders,
  createdAt: new Date().toISOString(),
};
const report2: Types.IReportDocument = {
  _id: "report2",
  name: "My awesome report",
  description: "My description",
  owner: user._id,
  storeId: store._id,
  orders,
  createdAt: new Date().toISOString(),
};
const reports = [report1, report2];

describe("DownloadReport Component", () => {
  afterEach(() => {
    cleanup();
  });
  let state: RootState;
  beforeEach(() => {
    /* Mock Canvas */
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value: jest.fn(() => ({
        fillRect: jest.fn(),
        clearRect: jest.fn(),
        getImageData: jest.fn(),
        putImageData: jest.fn(),
        createImageData: jest.fn(),
        setTransform: jest.fn(),
        drawImage: jest.fn(),
        save: jest.fn(),
        restore: jest.fn(),
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        closePath: jest.fn(),
        stroke: jest.fn(),
        fill: jest.fn(),
        measureText: jest.fn(() => ({ width: 50 })),
        transform: jest.fn(),
        scale: jest.fn(),
        rotate: jest.fn(),
        translate: jest.fn(),
        arc: jest.fn(),
        arcTo: jest.fn(),
        quadraticCurveTo: jest.fn(),
        bezierCurveTo: jest.fn(),
        createLinearGradient: jest.fn(),
        createRadialGradient: jest.fn(),
        createPattern: jest.fn(),
        fillText: jest.fn(),
        strokeText: jest.fn(),
        drawFocusIfNeeded: jest.fn(),
        clip: jest.fn(),
        isPointInPath: jest.fn(),
        isPointInStroke: jest.fn(),
        strokeRect: jest.fn(),
        rect: jest.fn(),
        fillStyle: "",
        strokeStyle: "",
        lineWidth: 1,
      })),
    });
    /* End Mock Canvas */
    mockUsePDF.mockReturnValue({
      toPDF: mockToPDF.mockImplementation(() => {}),
      targetRef: null as any,
    });
    mockedUseParams.mockReturnValue({ reportId: report1._id });
    state = generateFakeStore({
      users,
      stores,
      products,
      user: { connectedUser: user, selectedStore: store },
      cart: storeCart,
      orders,
      reports,
    });
  });
  test("should display order details", async () => {
    jest.useFakeTimers();
    await act(async () => {
      renderWithProviders(<DownloadReport />, { preloadedState: state });
    });

    const reportsList: HTMLElement[] =
      await screen.findAllByTestId("order-details-list");

    await waitFor(async () => {
      reportsList.forEach((reportList) => {
        expect(reportList).toBeInTheDocument();
      });
    });

    // Find the DataGrid container (it usually has role="grid")
    const dataGrids = screen.getAllByRole("grid");

    // Get all rows inside the DataGrid
    dataGrids.forEach((dataGrid) => {
      const rows = within(dataGrid).getAllByRole("row");
      const withoutHeader = rows.length - 1;
      expect(withoutHeader).toBe(2);
    });
  });
  test("should download pdf", async () => {
    jest.useFakeTimers();
    await act(async () => {
      renderWithProviders(<DownloadReport />, { preloadedState: state });
    });

    jest.advanceTimersByTime(2000);
    expect(mockToPDF).toHaveBeenCalledTimes(1);
  });
});
