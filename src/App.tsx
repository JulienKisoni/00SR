import React from "react";

import "./App.css";

import ErrorBoundary from "./components/ErrorBundary";
import Navigation from "./routes";

function App() {
  return (
    // @ts-ignore
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <Navigation />
    </ErrorBoundary>
  );
}

export default App;
