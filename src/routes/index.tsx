import { BrowserRouter, Routes, Route } from "react-router";

import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Settings from "./Settings";
import ProtectedRoute from "../components/ProtectedRoute";
import UnProtectedRoute from "../components/UnProtectedRoute";

const Navigation = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/signup"
          element={
            <UnProtectedRoute>
              <Signup />
            </UnProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Navigation;
