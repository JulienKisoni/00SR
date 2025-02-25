import React from "react";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { NotificationsProvider } from "@toolpad/core/useNotifications";

import "./App.css";

import ErrorBoundary from "./components/ErrorBoundary";
import { getStore } from "./services/redux/store";
import Navigation from "./components/Navigation";

const store = getStore();
const persistore = persistStore(store);

function App() {
  return (
    // @ts-ignore
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <Provider store={store}>
        <PersistGate loading="Loading datastore" persistor={persistore}>
          <NotificationsProvider>
            <BrowserRouter>
              <Navigation />
            </BrowserRouter>
          </NotificationsProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
