import React, { useState } from "react";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";

import "./App.css";

import ErrorBoundary from "./components/ErrorBundary";
import { Navigation, ConnectedNavigation } from "./routes";
import AppDrawer from "./components/AppDrawer";
import store from "./services/redux/store";

function App() {
  const [connected, setConnected] = useState(true);
  return (
    // @ts-ignore
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <Provider store={store}>
        <BrowserRouter>
          {!connected ? (
            <Navigation />
          ) : (
            <AppDrawer>
              <ConnectedNavigation />
            </AppDrawer>
          )}
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
