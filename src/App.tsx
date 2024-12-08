import React from "react";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

import "./App.css";

import ErrorBoundary from "./components/ErrorBoundary";
import store from "./services/redux/store";
import Navigation from "./components/Navigation";

const persistore = persistStore(store);

function App() {
  return (
    // @ts-ignore
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <Provider store={store}>
        <PersistGate loading="Loading datastore" persistor={persistore}>
          <BrowserRouter>
            <Navigation />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
