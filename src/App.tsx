import React, { useState } from "react";
import { BrowserRouter } from "react-router";

import "./App.css";

import ErrorBoundary from "./components/ErrorBundary";
import { Navigation, ConnectedNavigation } from "./routes";
import AppDrawer from "./components/AppDrawer";

function App() {
  const [connected, setConnected] = useState(true);
  return (
    // @ts-ignore
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <BrowserRouter>
        {!connected ? (
          <Navigation />
        ) : (
          <AppDrawer>
            <ConnectedNavigation />
          </AppDrawer>
        )}
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
