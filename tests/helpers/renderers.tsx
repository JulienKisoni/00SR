import React, { PropsWithChildren } from "react";
import { render, act } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router";
import { NotificationsProvider } from "@toolpad/core/useNotifications";
import TestRenderer from "react-test-renderer";
import type {
  TestRendererOptions,
  ReactTestInstance,
} from "react-test-renderer";

import type { AppStore } from "../../src/services/redux/store";
import { setupStore } from "../../src/services/redux/store";
import type { RootState } from "../../src/services/redux/rootReducer";
import ErrorBoundary from "../../src/components/ErrorBoundary";

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: RootState;
  store?: AppStore;
}
interface ExtendedCreateOptions {
  preloadedState?: RootState;
  store?: AppStore;
  renderOptions?: TestRendererOptions;
}

export function renderWithStore(
  ui: React.ReactElement,
  {
    preloadedState = {} as RootState,
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): React.JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    preloadedState = {} as RootState,
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) => {
  function Wrapper({ children }: PropsWithChildren<{}>): React.JSX.Element {
    return (
      // @ts-ignore
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <Provider store={store}>
          <NotificationsProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={children} />
              </Routes>
            </BrowserRouter>
          </NotificationsProvider>
        </Provider>
      </ErrorBoundary>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};
export const createWithProviders = async (
  ui: React.ReactElement,
  {
    preloadedState = {} as RootState,
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    renderOptions,
  }: ExtendedCreateOptions = {}
): Promise<ReactTestInstance> => {
  let testRenderer: TestRenderer.ReactTestRenderer;
  const AllProviders: React.FC<
    PropsWithChildren<{}>
  > = (): React.JSX.Element => {
    return (
      // @ts-ignore
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <Provider store={store}>
          <NotificationsProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={ui} />
              </Routes>
            </BrowserRouter>
          </NotificationsProvider>
        </Provider>
      </ErrorBoundary>
    );
  };
  await act(async () => {
    testRenderer = TestRenderer.create(<AllProviders />, renderOptions);
  });
  const instance = testRenderer!.root;
  return instance;
};
